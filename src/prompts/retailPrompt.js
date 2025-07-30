const howtodosales = `

Sales and Customer Delight 
Strategies
Enhancing customer experience and driving sales.

Greeting Customers
How may I 
help you?

Welcome Message: Staff should smile and Engagement Timing: After 5 
say, 'Welcome to NEWME.' minutes of browsing, ask, 'How 

Maintain Healthy Distance: Avoid appearing may I help you? What occasion 
too salesy. are you shopping for?'

Shopping Bag Protocol
Offer a Bag: When a customer holds a product, offer a carry bag and say, 'Please 
use the bag, ma'am.'
Bag Handling: Remove the hanger and place the product in the bag.
Staff Assistance: Hold the carry bag if there’s no rush, but gauge the customer's 
comfort.



Assisting with Sizes
Size Inquiry: Ask, 'What size are you looking for?'
Providing Sizes: Find and give the correct size to the customer.



Highlighting New Arrivals
Showcase New Products: Introduce new or exclusive collections, e.g., 'Splitsvilla Collection.'
Inform About Offers: Gently inform customers about ongoing promotions.

Trial Room Assistance
Are you buying these ?
Accompany to Trial Room: Help the customer with styles and remove hangers.
Post-Trial Inquiry: Ask, 'Are you buying these?' and take selected items to the 
billing counter.

Billing Counter Interaction
Engage with Questions: Ask about their shopping experience, how they heard 
about NEWME, and if this is their first purchase.
Handle Rejections: Ask why they didn’t like the items and offer solutions, like 
suggesting online purchases with a special coupon.

Collecting Customer Information
Information Request: Politely ask for their name and mobile number.
Thank You Message: Hand over the shopping bag with a coupon and say, 'Thank 
you for shopping with NEWME. We hope to see you again!'

Understanding Buying Behavior
Observation: Notice items customers spend time on.
Engagement: Discover their style preferences or the occasion they are shopping 
for.

Cross-Selling and Upselling
Product Pairing: Recommend matching items, e.g., skirts with tops.
Promotion: Inform customers about chances to win discounts.

Sales Hacks
Greet with a Smile: Set a positive tone.
Product Knowledge: Be informed about trends and products.
Highlight Offers: Always mention current promotions.

Delivering Customer Delight
Personal Touch: Use the customer's name.
Extra Mile: Offer styling tips.
Example: 'Thank you for shopping with us. Don't forget to check our fresh drop section next time!'


Collecting Feedback
Direct Questions: Engage customers about their experience.
Feedback Form: Offer an instant discount for filling out a Google review.

Role Plays on Customer Experience
Empathy in Interactions: Handle dissatisfaction with understanding.
Going Above and Beyond: Offer alternatives if a size is unavailable.
Managing Difficult Conversations: Handle returns and grievances with care.

Managing Difficult Conversations
Stay Calm and Listen: Allow customers to express their concerns.
Empathize: Show understanding and acknowledge their feelings.
Grievance Form: Create an offline form for complaints.

Examples and Strategies
Product Quality Complaint: Listen, apologize, and offer a replacement.
Miscommunication on Offers: Apologize and if possible, honor the discount.

`;

const sysPrompt = `
I am uploading a recorded sales conversation between a store staff and a customer at an Indian fashion retail store.
Your task is to objectively analyze the audio and return the following output in a structured format, based on best practices and training guidelines from the attached sales guide (NEWME Apparel Store Staff Guide):

⸻

PART 1: Store Staff Evaluation (Scores & Feedback)
Evaluate the staff’s performance across the following 3 parameters.
For each, provide:
	•	A rating out of 5
	•	What the staff did well (with timestamped examples if possible)
	•	What they could improve (with constructive suggestions)

	1.	Product Knowledge
	2.	Relationship Building
	3.	Selling Skills

⸻

PART 2: Customer Insights (Summarize Top 3 Insights)
Based on what the customer said (explicitly or implicitly), extract:
	1.	What did they like about the experience/products
	2.	What did they not like or were dissatisfied with
	3.	What were they asking for or expecting but didn’t receive

⸻

Important Notes for Output Consistency:
	•	Be as objective and repeatable as possible; assume the same audio will return the same insights each time.
	•	Stick to factual observations, not assumptions.
	•	Refer to phrases, behavior, or tone that violate or match SOPs in the sales guide (e.g., whether they offered trial room assistance, explained offers, built rapport, etc.)
	•	Keep the tone supportive and professional. The goal is to train and improve performance, not penalize.

⸻

Format your response clearly using markdown or bullet points.
Once you’re ready, I’ll upload the audio file.
`;

export { sysPrompt, howtodosales };