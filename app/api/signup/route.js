export async function POST(req) {
    const body = await req.json();
  
    const { fullName, email, password } = body;
  
    if (!fullName || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required.' }), { status: 400 });
    }
  
    return new Response(JSON.stringify({ fullName, email }), { status: 200 });
  }
  