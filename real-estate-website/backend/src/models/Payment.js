const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["Credit Card", "Debit Card", "Bank Transfer", "Cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    propertyType: {
      type: String,
      enum: ["Land", "House", "Apartment", "Service"],
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "propertyType",
    },
    transactionId: {
      type: String,
      required: false,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentPlan: {
      type: String,
      enum: ["Full Payment", "Installment"],
      default: "Full Payment",
    },
    installmentDetails: {
      totalInstallments: {
        type: Number,
        required: function () {
          return this.paymentPlan === "Installment";
        },
      },
      installmentsPaid: {
        type: Number,
        default: 1,
        required: function () {
          return this.paymentPlan === "Installment";
        },
      },
      nextPaymentDue: {
        type: Date,
        required: function () {
          return (
            this.paymentPlan === "Installment" &&
            this.installmentDetails.installmentsPaid <
              this.installmentDetails.totalInstallments
          );
        },
      },
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
