import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientMessage, currentExercise, completedReps } = body;

    if (typeof patientMessage !== 'string') {
      return NextResponse.json({ error: 'patientMessage is required' }, { status: 400 });
    }

    const messageLower = patientMessage.toLowerCase();
    
    // Safety & Pain Detection
    if (messageLower.includes('pain') || messageLower.includes('dard') || messageLower.includes('chot')) {
      return NextResponse.json({
        reply: "Kripya turant ruk jayein. Session pause kar diya gaya hai aur Dr. Marcus ko alert bhej diya gaya hai.",
        action: "pause_session"
      });
    }
    
    // Progress & Rep Queries
    if (messageLower.includes('how many') || messageLower.includes('kitne')) {
      return NextResponse.json({
        reply: `Aapne ${completedReps || 0} reps poore kar liye hain. Bas thode aur baaki hain, aap bohot achha kar rahe hain!`,
        action: "continue"
      });
    }
    
    // Fatigue & Break Detection
    if (messageLower.includes('thak') || messageLower.includes('tired')) {
      return NextResponse.json({
        reply: "Koi baat nahi, 10 second ka break lijiye. Gehra saans lein.",
        action: "break"
      });
    }
    
    // Default Fallback Coaching
    return NextResponse.json({
      reply: "Aapka form bilkul theek hai, focus banaye rakhein.",
      action: "continue"
    });

  } catch (error) {
    console.error("Coach API Error:", error);
    return NextResponse.json({ 
      reply: "Aapka form bilkul theek hai, focus banaye rakhein.",
      action: "continue",
      error: "Internal Server Error"
    }, { status: 200 });
  }
}
