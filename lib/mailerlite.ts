export async function addToMailerLite(subscriber: {
  email: string;
  name?: string;
  fields?: Record<string, any>;
}) {
  try {
    const apiKey = process.env.MAILERLITE_API_KEY;
    
    // Defaulting to MailerLite v2 API
    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': apiKey!,
      },
      body: JSON.stringify({
        email: subscriber.email,
        name: subscriber.name,
        fields: subscriber.fields,
        resubscribe: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('MailerLite error:', error);
      throw new Error('Failed to add to MailerLite');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding to MailerLite:', error);
    throw error;
  }
}
