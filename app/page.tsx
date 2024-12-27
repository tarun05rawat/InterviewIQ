import { Button } from '@/components/ui/button'
import { Mic, Play, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            InterviewIQ
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master your interview skills with AI-powered practice sessions. Record, review, and improve your responses.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <Mic className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Practice Interviews</h3>
            <p className="text-muted-foreground">
              Record your responses to common interview questions and get instant feedback.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <Play className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Review & Improve</h3>
            <p className="text-muted-foreground">
              Listen to your recordings and track your progress over time.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn & Grow</h3>
            <p className="text-muted-foreground">
              Access a vast library of interview questions across different categories.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/practice">
            <Button size="lg" className="mr-4">
              Start Practicing
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}