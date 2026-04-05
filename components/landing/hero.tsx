import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Languages, Play, Zap, Globe } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm text-muted-foreground ring-1 ring-border">
              Now supporting 30+ languages{" "}
              <span className="font-semibold text-primary">with AI lip-sync</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI Video Dubbing
            <br />
            <span className="text-muted-foreground">in 30+ Languages</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Upload your video. AI transcribes, translates, clones the speaker&apos;s
            voice, and syncs lips — all automatically. Go global in minutes,
            not weeks.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="h-12 px-8 text-base" render={<Link href="/login" />}>
              Start Dubbing Free
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base" render={<Link href="#how-it-works" />}>
              <Play className="mr-2 h-4 w-4" />
              See How It Works
            </Button>
          </div>
        </div>

        {/* How it works */}
        <div id="how-it-works" className="mx-auto mt-24 max-w-5xl">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Three simple steps to reach a global audience
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Languages className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">1. Upload</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload your video file. We support MP4, MOV, AVI, and more up to
                5GB.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">2. AI Processes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                AI transcribes, translates, clones the voice, and syncs lips
                automatically.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Globe className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">3. Download</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Download your dubbed videos in all selected languages, ready to
                publish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
