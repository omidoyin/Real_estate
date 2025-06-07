/**
 * Cloudinary Direct Upload Utility
 * Handles direct file uploads to Cloudinary from the frontend
 */

import { getCloudinarySignature as getSignatureFromAPI } from "./api";

/**
 * Get Cloudinary signature for secure upload
 */
export const getCloudinarySignature = async () => {
  try {
    console.log("Requesting Cloudinary signature from backend...");
    const response = await getSignatureFromAPI();
    console.log("Signature response:", response);
    return response.data;
  } catch (error) {
    console.error("Error getting Cloudinary signature:", error);
    throw error;
  }
};

/**
 * Upload a single file to Cloudinary
 */
export const uploadFileToCloudinary = async (file, onProgress = null) => {
  try {
    // Get signature from backend
    const signatureData = await getCloudinarySignature();

    console.log("Signature data received:", signatureData);

    // Prepare form data - IMPORTANT: Parameters must match exactly what was used to generate signature
    // The order doesn't matter for FormData, but the parameter names and values must be exact
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("folder", signatureData.folder);
    formData.append("resource_type", "auto");
    formData.append("signature", signatureData.signature);
    formData.append("timestamp", signatureData.timestamp.toString());

    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/upload`;

    console.log("=== CLOUDINARY UPLOAD ===");
    console.log("Uploading to:", uploadUrl);
    console.log("Upload parameters:");
    console.log("- api_key:", signatureData.apiKey);
    console.log("- folder:", signatureData.folder);
    console.log("- resource_type: auto");
    console.log("- signature:", signatureData.signature);
    console.log("- timestamp:", signatureData.timestamp);
    console.log("- file:", file.name, "(" + file.size + " bytes)");

    // Verify parameters match signature generation order
    // Note: resource_type=auto is NOT included in signature generation
    const verifyParams = {
      folder: signatureData.folder,
      timestamp: signatureData.timestamp,
    };
    const sortedKeys = Object.keys(verifyParams).sort();
    const paramString = sortedKeys
      .map((key) => `${key}=${verifyParams[key]}`)
      .join("&");
    console.log("Frontend parameter string (for verification):", paramString);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log("Upload response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload error response:", errorText);
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log("Upload successful:", result);

    // Return the secure URL
    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
    };
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
};

/**
 * Upload multiple files to Cloudinary
 */
export const uploadMultipleFilesToCloudinary = async (
  files,
  onProgress = null
) => {
  try {
    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await uploadFileToCloudinary(file);

        // Call progress callback if provided
        if (onProgress) {
          onProgress(index + 1, files.length);
        }

        return {
          success: true,
          file: file,
          result: result,
        };
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        return {
          success: false,
          file: file,
          error: error.message,
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    // Separate successful and failed uploads
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    return {
      successful: successful.map((r) => r.result),
      failed: failed,
      totalUploaded: successful.length,
      totalFailed: failed.length,
    };
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
};

/**
 * Upload images and return URLs
 */
export const uploadImages = async (imageFiles, onProgress = null) => {
  if (!imageFiles || imageFiles.length === 0) {
    return [];
  }

  try {
    const results = await uploadMultipleFilesToCloudinary(
      imageFiles,
      onProgress
    );

    if (results.failed.length > 0) {
      console.warn(
        `${results.failed.length} images failed to upload:`,
        results.failed
      );
    }

    return results.successful.map((result) => result.url);
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

/**
 * Upload a single video and return URL
 */
export const uploadVideo = async (videoFile, onProgress = null) => {
  if (!videoFile) {
    return null;
  }

  try {
    const result = await uploadFileToCloudinary(videoFile, onProgress);
    return result.url;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

/**
 * Upload a brochure (PDF) and return URL
 */
export const uploadBrochure = async (brochureFile, onProgress = null) => {
  if (!brochureFile) {
    return null;
  }

  try {
    const result = await uploadFileToCloudinary(brochureFile, onProgress);
    return result.url;
  } catch (error) {
    console.error("Error uploading brochure:", error);
    throw error;
  }
};

/**
 * Upload documents and return URLs with metadata
 */
export const uploadDocuments = async (documentFiles, onProgress = null) => {
  if (!documentFiles || documentFiles.length === 0) {
    return [];
  }

  try {
    const results = await uploadMultipleFilesToCloudinary(
      documentFiles,
      onProgress
    );

    if (results.failed.length > 0) {
      console.warn(
        `${results.failed.length} documents failed to upload:`,
        results.failed
      );
    }

    // Return documents with name and URL
    return results.successful.map((result, index) => ({
      name: documentFiles[index].name.replace(/\.[^/.]+$/, ""), // Remove file extension
      url: result.url,
    }));
  } catch (error) {
    console.error("Error uploading documents:", error);
    throw error;
  }
};

/**
 * Helper function to validate file types
 */
export const validateFileType = (file, allowedTypes) => {
  const fileType = file.type.toLowerCase();
  return allowedTypes.some((type) => fileType.includes(type));
};

/**
 * Helper function to validate file size
 */
export const validateFileSize = (file, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate image files
 */
export const validateImages = (files) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const maxSize = 10; // 10MB

  const errors = [];

  files.forEach((file, index) => {
    if (!validateFileType(file, allowedTypes)) {
      errors.push(
        `Image ${
          index + 1
        }: Invalid file type. Only JPEG, PNG, and GIF are allowed.`
      );
    }
    if (!validateFileSize(file, maxSize)) {
      errors.push(
        `Image ${index + 1}: File size too large. Maximum size is ${maxSize}MB.`
      );
    }
  });

  return errors;
};

/**
 * Validate video file
 */
export const validateVideo = (file) => {
  const allowedTypes = ["video/mp4", "video/mov", "video/avi"];
  const maxSize = 100; // 100MB

  const errors = [];

  if (!validateFileType(file, allowedTypes)) {
    errors.push("Invalid video file type. Only MP4, MOV, and AVI are allowed.");
  }
  if (!validateFileSize(file, maxSize)) {
    errors.push(`Video file size too large. Maximum size is ${maxSize}MB.`);
  }

  return errors;
};

/**
 * Validate brochure file
 */
export const validateBrochure = (file) => {
  const allowedTypes = ["application/pdf"];
  const maxSize = 20; // 20MB

  const errors = [];

  if (!validateFileType(file, allowedTypes)) {
    errors.push("Invalid brochure file type. Only PDF files are allowed.");
  }
  if (!validateFileSize(file, maxSize)) {
    errors.push(`Brochure file size too large. Maximum size is ${maxSize}MB.`);
  }

  return errors;
};

/**
 * Validate document files
 */
export const validateDocuments = (files) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const maxSize = 20; // 20MB

  const errors = [];

  files.forEach((file, index) => {
    if (!validateFileType(file, allowedTypes)) {
      errors.push(
        `Document ${
          index + 1
        }: Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.`
      );
    }
    if (!validateFileSize(file, maxSize)) {
      errors.push(
        `Document ${
          index + 1
        }: File size too large. Maximum size is ${maxSize}MB.`
      );
    }
  });

  return errors;
};
