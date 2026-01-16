interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  // For development - simulate API call
  if (import.meta.env.DEV) {
    console.log('Development mode - simulating email send:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      return {
        success: true,
        message: 'Your message has been sent successfully!'
      };
    } else {
      throw new Error('Simulated network error');
    }
  }

  // Production API call
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to send message');
    }
    
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}