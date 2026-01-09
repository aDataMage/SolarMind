export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML or Markdown for now
    coverImage: string;
    date: string;
    author: {
        name: string;
        avatar: string;
    };
    category: string;
    readTime: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'future-of-solar-energy-2026',
        title: 'The Future of Solar Energy: Trends to Watch in 2026',
        excerpt: 'From bifacial panels to solid-state batteries, here are the technologies shaping the renewable landscape.',
        content: `
      <h2>The Dawn of a New Solar Era</h2>
      <p>As we move further into the decade, solar technology is not just improving; it's transforming. Efficiency rates that were once theoretical are now standard, and storage solutions are becoming as common as the panels themselves.</p>
      <h3>1. Perovskite Cells</h3>
      <p>The buzz around perovskite has been growing, and 2026 might be the year we see widespread commercial adoption. These cells promise higher efficiency at a fraction of the manufacturing cost.</p>
      <h3>2. AI-Driven Energy Management</h3>
      <p>Smart homes are getting smarter. New inverters effectively "talk" to the grid and your appliances to buy low and sell high, maximizing your ROI automatically.</p>
      <p>Stay tuned as we explore these technologies in depth in our upcoming series.</p>
    `,
        coverImage: 'https://placehold.co/800x400/222/FFF?text=Solar+Trends',
        date: 'Jan 15, 2026',
        author: {
            name: 'Dr. Sarah Watts',
            avatar: 'https://placehold.co/100x100/222/FFF?text=SW',
        },
        category: 'Technology',
        readTime: '5 min read',
    },
    {
        slug: 'how-to-size-your-battery-bank',
        title: 'How to Correctly Size Your Home Battery Bank',
        excerpt: 'Avoid blackouts and save money by choosing the right storage capacity for your lifestyle.',
        content: `
      <h2>Understanding Your Consumption</h2>
      <p>Before buying a battery, you need to know your "base load." This is the minimum amount of power your home uses to keep the lights on and the fridge running.</p>
      <h2>The "Days of Autonomy" Rule</h2>
      <p>How many days do you want to survive without the grid or sun? For most suburban homes, 1 day (approx 10-15kWh) is sufficient. For off-grid cabins, aim for 3 days.</p>
    `,
        coverImage: 'https://placehold.co/800x400/222/FFF?text=Battery+Sizing',
        date: 'Dec 22, 2025',
        author: {
            name: 'Mike Volt',
            avatar: 'https://placehold.co/100x100/222/FFF?text=MV',
        },
        category: 'Guides',
        readTime: '8 min read',
    },
    {
        slug: 'solar-maintenance-tips',
        title: '5 Essential Maintenance Tips for Peak Performance',
        excerpt: 'Keep your system generating at 100% with these simple seasonal checks.',
        content: `
      <p>Solar panels are remarkably durable, but a little care goes a long way.</p>
      <ul>
        <li><strong>Clean Debris:</strong> Leaves and bird droppings can create "hot spots" that reduce efficiency.</li>
        <li><strong>Check Inverter Display:</strong> Look for any red error lights or unusual warnings.</li>
        <li><strong>Trimming Trees:</strong> Ensure new growth hasn't started shading your array.</li>
      </ul>
    `,
        coverImage: 'https://placehold.co/800x400/222/FFF?text=Maintenance',
        date: 'Nov 10, 2025',
        author: {
            name: 'Elena Ray',
            avatar: 'https://placehold.co/100x100/222/FFF?text=ER',
        },
        category: 'Maintenance',
        readTime: '4 min read',
    }
];
