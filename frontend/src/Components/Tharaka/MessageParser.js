class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowercase = message.toLowerCase();

    if (
      lowercase.includes("what do you sell") ||
      lowercase.includes("products") ||
      lowercase.includes("show me products") ||
      lowercase.includes("product list") ||
      lowercase.includes("categories")
    ) {
      this.actionProvider.handleSiteInfo();
    }

    else if (
      lowercase.includes("delivery") ||
      lowercase.includes("shipping") ||
      lowercase.includes("ship") ||
      lowercase.includes("home delivery")
    ) {
      this.actionProvider.handleShippingInfo();
    }

    else if (
      lowercase.includes("payment") ||
      lowercase.includes("pay") ||
      lowercase.includes("credit card") ||
      lowercase.includes("cash on delivery")
    ) {
      this.actionProvider.handlePaymentInfo();
    }

    else if (
      lowercase.includes("account") ||
      lowercase.includes("sign up") ||
      lowercase.includes("create account") ||
      lowercase.includes("order") ||
      lowercase.includes("track my order")
    ) {
      this.actionProvider.handleOrderInfo();
    }

  
    else if (
      lowercase.includes("contact") ||
      lowercase.includes("support") ||
      lowercase.includes("help") ||
      lowercase.includes("customer service")
    ) {
      this.actionProvider.handleSupportInfo();
    }

    else if (
      lowercase.includes("cart") ||
      lowercase.includes("checkout") ||
      lowercase.includes("add to cart")
    ) {
      this.actionProvider.handleCartInfo();
    }

    else if (
      lowercase.includes("return") ||
      lowercase.includes("refund") ||
      lowercase.includes("exchange")
    ) {
      this.actionProvider.handleReturnPolicy();
    }

    // Fallback
    else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
