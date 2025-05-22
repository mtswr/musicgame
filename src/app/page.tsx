import Genre from "@/components/genre";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-6">

      <p className="text-[#9ca3af] text-center mb-2">Test your music knowledge</p>
      <p className="text-[#9ca3af] text-center mb-6">Every day, you'll get 3 new random songs from each genre. Like Wordle, but for music! Listen to snippets and try to guess the songs. Choose a genre below to start playing.</p>
      <Genre />
    </div>
  );
}
