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
    if (messageLower.includes('pain') || messageLower.includes('hurt') || messageLower.includes('dard')) {
      return NextResponse.json({
        reply: "Please stop immediately. I am pausing the session and notifying Dr. Marcus.",
        action: "pause_session"
      });
    }
    
    // Progress & Rep Queries
    if (messageLower.includes('how many') || messageLower.includes('left') || messageLower.includes('kitne')) {
      return NextResponse.json({
        reply: `You have completed ${completedReps || 0} reps. Just a few more to go, you are doing great!`,
        action: "continue"
      });
    }
    
    // Fatigue & Break Detection
    if (messageLower.includes('tired') || messageLower.includes('thak')) {
      return NextResponse.json({
        reply: "It's okay to take a 10-second break. Breathe deeply.",
        action: "break"
      });
    }
    
    // Default Fallback Coaching
    return NextResponse.json({
      reply: "Keep your focus steady. Your form looks good.",
      action: "continue"
    });

  } catch (error) {
    console.error("Coach API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
