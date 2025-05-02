class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  addMessageToState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }

  handleSiteInfo = () => {
    const message = this.createChatBotMessage(
      "We sell electronics, fashion, and home essentials. You can browse all products on our home page."
    );
    this.addMessageToState(message);
  };

  handleShippingInfo = () => {
    const message = this.createChatBotMessage(
      "We offer fast and reliable shipping across the country. Free shipping on orders over Rs. 5,000!"
    );
    this.addMessageToState(message);
  };

  handlePaymentInfo = () => {
    const message = this.createChatBotMessage(
      "We accept credit/debit cards, mobile payments, and cash on delivery."
    );
    this.addMessageToState(message);
  };

  handleOrderInfo = () => {
    const message = this.createChatBotMessage(
      "You can create an account to view or track your orders from the profile page."
    );
    this.addMessageToState(message);
  };

  handleSupportInfo = () => {
    const message = this.createChatBotMessage(
      "You can contact our support team through the contact page or email support@example.com."
    );
    this.addMessageToState(message);
  };

  handleCartInfo = () => {
    const message = this.createChatBotMessage(
      "To add items to your cart, click 'Add to Cart' on any product. Visit your cart anytime to review your selections."
    );
    this.addMessageToState(message);
  };

  handleReturnPolicy = () => {
    const message = this.createChatBotMessage(
      "You can return items within 7 days of delivery. Please read our return policy for more info."
    );
    this.addMessageToState(message);
  };

  handleUnknown = () => {
    const message = this.createChatBotMessage(
      "I'm sorry, I didn't quite get that. Can you ask something else about our website?"
    );
    this.addMessageToState(message);
  };
}

export default ActionProvider;
