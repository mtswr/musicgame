// "use client"
// import { Play, SkipForward, X, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useState, useEffect, useRef, useReducer } from "react"
// import { useDebounce } from "@/hooks/use-debounce"
// import { GameResultDialog } from "./game-result-dialog"
// import { GameSummaryDialog } from "./game-summary-dialog"
// import { VolumeControl } from "./volume-control"

// interface Track {
//   id: string;
//   gameId: string;
//   preview_url: string;
// }

// interface Suggestion {
//   id: string;
//   name: string;
//   artists: string;
// }

// interface Attempt {
//   skipped: boolean;
//   correct?: boolean;
//   correctName?: string;
//   artists?: string[];
//   timeToGuess?: number;
// }

// interface TrackResult {
//   name: string;
//   artists: string[];
//   timeToGuess: number;
//   correct: boolean;
//   albumCover?: string;
//   segment: number;
//   trackId?: string;
// }

// const AUDIO_SEGMENTS = [0.1, 0.5, 2, 4, 8, 15];
// const TOTAL_DURATION = 30;

// interface GameState {
//   tracks: Track[];
//   currentTrackIndex: number;
//   attempts: Attempt[];
//   currentSegment: number;
//   progress: number;
//   completedTracks: TrackResult[];
//   currentResult: TrackResult | null;
// }

// interface AudioState {
//   isPlaying: boolean;
//   startTime: number;
// }

// interface UIState {
//   showResultModal: boolean;
//   showGameSummary: boolean;
//   isLoading: boolean;
// }

// interface SearchState {
//   guess: string;
//   searchQuery: string;
//   showSuggestions: boolean;
//   searchEnabled: boolean;
//   suggestions: Suggestion[];
// }

// type GameAction =
//   | { type: 'LOAD_TRACKS', payload: Track[] }
//   | { type: 'NEXT_TRACK' }
//   | { type: 'RESET_TRACK' }
//   | { type: 'ADD_ATTEMPT', payload: Attempt }
//   | { type: 'SET_SEGMENT', payload: number }
//   | { type: 'UPDATE_PROGRESS', payload: number }
//   | { type: 'SET_CURRENT_RESULT', payload: TrackResult }
//   | { type: 'ADD_COMPLETED_TRACK', payload: TrackResult };

// type AudioAction =
//   | { type: 'PLAY' }
//   | { type: 'PAUSE' }
//   | { type: 'SET_START_TIME', payload: number };

// type UIAction =
//   | { type: 'TOGGLE_RESULT_MODAL', payload: boolean }
//   | { type: 'TOGGLE_GAME_SUMMARY', payload: boolean }
//   | { type: 'SET_LOADING', payload: boolean };

// type SearchAction =
//   | { type: 'SET_GUESS', payload: string }
//   | { type: 'SET_SEARCH_QUERY', payload: string }
//   | { type: 'SET_SUGGESTIONS', payload: Suggestion[] }
//   | { type: 'TOGGLE_SUGGESTIONS', payload: boolean }
//   | { type: 'SET_SEARCH_ENABLED', payload: boolean }
//   | { type: 'RESET_SEARCH' };

// const gameReducer = (state: GameState, action: GameAction): GameState => {
//   switch (action.type) {
//     case 'LOAD_TRACKS':
//       return { ...state, tracks: action.payload };
//     case 'NEXT_TRACK':
//       if (state.currentTrackIndex + 1 < state.tracks.length) {
//         return {
//           ...state,
//           currentTrackIndex: state.currentTrackIndex + 1,
//           attempts: [],
//           currentSegment: 0,
//           progress: 0,
//           currentResult: null
//         };
//       }
//       return state;
//     case 'RESET_TRACK':
//       return {
//         ...state,
//         attempts: [],
//         currentSegment: 0,
//         progress: 0,
//         currentResult: null
//       };
//     case 'ADD_ATTEMPT':
//       return { ...state, attempts: [...state.attempts, action.payload] };
//     case 'SET_SEGMENT':
//       return { ...state, currentSegment: action.payload };
//     case 'UPDATE_PROGRESS':
//       return { ...state, progress: action.payload };
//     case 'SET_CURRENT_RESULT':
//       return { ...state, currentResult: action.payload };
//     case 'ADD_COMPLETED_TRACK':
//       const trackAlreadyCompleted = state.completedTracks.some(
//         track => track.trackId === action.payload.trackId
//       );
//       if (trackAlreadyCompleted) return state;
//       return {
//         ...state,
//         completedTracks: [...state.completedTracks, action.payload]
//       };
//     default:
//       return state;
//   }
// };

// const audioReducer = (state: AudioState, action: AudioAction): AudioState => {
//   switch (action.type) {
//     case 'PLAY':
//       return { ...state, isPlaying: true };
//     case 'PAUSE':
//       return { ...state, isPlaying: false };
//     case 'SET_START_TIME':
//       return { ...state, startTime: action.payload };
//     default:
//       return state;
//   }
// };

// const uiReducer = (state: UIState, action: UIAction): UIState => {
//   switch (action.type) {
//     case 'TOGGLE_RESULT_MODAL':
//       return { ...state, showResultModal: action.payload };
//     case 'TOGGLE_GAME_SUMMARY':
//       return { ...state, showGameSummary: action.payload };
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     default:
//       return state;
//   }
// };

// const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
//   switch (action.type) {
//     case 'SET_GUESS':
//       return { ...state, guess: action.payload };
//     case 'SET_SEARCH_QUERY':
//       return { ...state, searchQuery: action.payload };
//     case 'SET_SUGGESTIONS':
//       return { ...state, suggestions: action.payload };
//     case 'TOGGLE_SUGGESTIONS':
//       return { ...state, showSuggestions: action.payload };
//     case 'SET_SEARCH_ENABLED':
//       return { ...state, searchEnabled: action.payload };
//     case 'RESET_SEARCH':
//       return {
//         ...state,
//         guess: "",
//         searchQuery: "",
//         suggestions: [],
//         showSuggestions: false
//       };
//     default:
//       return state;
//   }
// };

// export default function MusicGame({ genre }: { genre: string }) {
//   const [gameState, gameDispatch] = useReducer(gameReducer, {
//     tracks: [],
//     currentTrackIndex: 0,
//     attempts: [],
//     currentSegment: 0,
//     progress: 0,
//     completedTracks: [],
//     currentResult: null
//   });

//   const [audioState, audioDispatch] = useReducer(audioReducer, {
//     isPlaying: false,
//     startTime: 0
//   });

//   const [uiState, uiDispatch] = useReducer(uiReducer, {
//     showResultModal: false,
//     showGameSummary: false,
//     isLoading: false
//   });

//   const [searchState, searchDispatch] = useReducer(searchReducer, {
//     guess: "",
//     searchQuery: "",
//     showSuggestions: false,
//     searchEnabled: true,
//     suggestions: []
//   });

//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const debouncedSearchQuery = useDebounce(searchState.searchQuery, 300);

//   const { tracks, currentTrackIndex, attempts, currentSegment, progress, completedTracks, currentResult } = gameState;
//   const { isPlaying } = audioState;
//   const { showResultModal, showGameSummary, isLoading } = uiState;
//   const { guess, searchQuery, showSuggestions, searchEnabled, suggestions } = searchState;

//   useEffect(() => {
//     const fetchTracks = async () => {
//       try {
//         uiDispatch({ type: 'SET_LOADING', payload: true });
//         const response = await fetch(`/api/spotify/recommendations?genre=${genre}`);
//         const data = await response.json();
//         gameDispatch({ type: 'LOAD_TRACKS', payload: data.tracks });
//       } catch (error) {
//       } finally {
//         uiDispatch({ type: 'SET_LOADING', payload: false });
//       }
//     };

//     fetchTracks();
//   }, [genre]);

//   useEffect(() => {
//     if (!searchEnabled) return;

//     const fetchSuggestions = async () => {
//       if (debouncedSearchQuery.length < 2) {
//         searchDispatch({ type: 'SET_SUGGESTIONS', payload: [] });
//         searchDispatch({ type: 'TOGGLE_SUGGESTIONS', payload: false });
//         return;
//       }

//       uiDispatch({ type: 'SET_LOADING', payload: true });
//       try {
//         const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
//         if (response.ok) {
//           const data = await response.json();
//           searchDispatch({ type: 'SET_SUGGESTIONS', payload: data });
//           searchDispatch({ type: 'TOGGLE_SUGGESTIONS', payload: data.length > 0 });
//           if (inputRef.current) {
//             inputRef.current.focus();
//           }
//         }
//       } catch (error) {
//         searchDispatch({ type: 'SET_SUGGESTIONS', payload: [] });
//         searchDispatch({ type: 'TOGGLE_SUGGESTIONS', payload: false });
//       } finally {
//         uiDispatch({ type: 'SET_LOADING', payload: false });
//       }
//     };

//     fetchSuggestions();
//   }, [debouncedSearchQuery, searchEnabled]);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//       audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

//       const segmentDuration = AUDIO_SEGMENTS[currentSegment];
//       const timeoutId = setTimeout(() => {
//         if (audioRef.current && isPlaying) {
//           audioRef.current.pause();
//           audioDispatch({ type: 'PAUSE' });
//         }
//       }, segmentDuration * 1000 + 100);

//       return () => {
//         if (audioRef.current) {
//           audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
//         }
//         clearTimeout(timeoutId);
//       };
//     }
//   }, [currentSegment, isPlaying]);

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       const currentTime = audioRef.current.currentTime;
//       const segmentDuration = AUDIO_SEGMENTS[currentSegment];

//       const completedSegmentsDuration = AUDIO_SEGMENTS.slice(0, currentSegment).reduce((sum, duration) => sum + duration, 0);
//       const totalProgress = ((completedSegmentsDuration + Math.min(currentTime, segmentDuration)) / TOTAL_DURATION) * 100;

//       gameDispatch({ type: 'UPDATE_PROGRESS', payload: totalProgress });

//       if (currentTime >= segmentDuration) {
//         audioRef.current.pause();
//         audioDispatch({ type: 'PAUSE' });
//       }
//     }
//   };

//   const handlePlay = () => {
//     if (tracks[currentTrackIndex] && audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//         audioDispatch({ type: 'PAUSE' });
//         return;
//       }

//       if (currentSegment === 0) {
//         audioDispatch({ type: 'SET_START_TIME', payload: Date.now() });
//       }

//       audioRef.current.currentTime = 0;

//       audioRef.current.onended = () => {
//         audioDispatch({ type: 'PAUSE' });
//       };

//       const playPromise = audioRef.current.play();

//       if (playPromise !== undefined) {
//         playPromise.then(() => {
//           audioDispatch({ type: 'PLAY' });
//         }).catch(error => {
//         });
//       }
//     }
//   };

//   const handleSkip = () => {
//     if (showResultModal) return;

//     if (audioRef.current && isPlaying) {
//       audioRef.current.pause();
//       audioDispatch({ type: 'PAUSE' });
//     }

//     const newAttempt = { skipped: true, timeToGuess: 0 };
//     gameDispatch({ type: 'ADD_ATTEMPT', payload: newAttempt });

//     if (attempts.length + 1 >= 6) {
//       setTimeout(() => finishTrack(), 10);
//     } else {
//       const nextSegment = Math.min(attempts.length + 1, AUDIO_SEGMENTS.length - 1);
//       gameDispatch({ type: 'SET_SEGMENT', payload: nextSegment });
//     }
//   };

//   const handleSubmit = async () => {
//     if (showResultModal) return;

//     if (audioRef.current && isPlaying) {
//       audioRef.current.pause();
//       audioDispatch({ type: 'PAUSE' });
//     }

//     const currentTrack = tracks[currentTrackIndex];

//     try {
//       const response = await fetch('/api/spotify/verify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           gameId: currentTrack.gameId,
//           guess,
//         }),
//       });

//       const data = await response.json();

//       const newAttempt = {
//         skipped: false,
//         correct: data.correct,
//         correctName: data.correctName,
//         artists: data.artists,
//         timeToGuess: 0,
//       };

//       gameDispatch({ type: 'ADD_ATTEMPT', payload: newAttempt });
//       searchDispatch({ type: 'RESET_SEARCH' });

//       if (data.correct) {
//         const segmentDuration = AUDIO_SEGMENTS[currentSegment];

//         const resultData = {
//           name: data.correctName || '',
//           artists: data.artists || [],
//           timeToGuess: segmentDuration,
//           correct: true,
//           albumCover: data.albumCover,
//           segment: currentSegment,
//           trackId: currentTrack.id
//         };

//         gameDispatch({ type: 'SET_CURRENT_RESULT', payload: resultData });
//         gameDispatch({ type: 'ADD_COMPLETED_TRACK', payload: resultData });
//         uiDispatch({ type: 'TOGGLE_RESULT_MODAL', payload: true });
//       } else if (attempts.length + 1 >= 6) {
//         setTimeout(() => finishTrack(), 10);
//       } else {
//         const nextSegment = Math.min(attempts.length + 1, AUDIO_SEGMENTS.length - 1);
//         gameDispatch({ type: 'SET_SEGMENT', payload: nextSegment });
//       }
//     } catch (error) {
//     }
//   };

//   const finishTrack = async () => {
//     if (showResultModal) return;

//     uiDispatch({ type: 'TOGGLE_RESULT_MODAL', payload: true });

//     let lastGuess = 'skip';
//     for (let i = attempts.length - 1; i >= 0; i--) {
//       if (!attempts[i].skipped && attempts[i].correct !== undefined && attempts[i].correct === false && attempts[i].correctName) {
//         lastGuess = attempts[i].correctName ?? '';
//         break;
//       }
//     }
//     if ((!lastGuess || lastGuess === 'skip') && guess && guess.trim() !== '') {
//       lastGuess = guess;
//     }
//     if (!lastGuess || lastGuess.trim() === '') lastGuess = 'skip';

//     try {
//       const response = await fetch('/api/spotify/verify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           gameId: tracks[currentTrackIndex].gameId,
//           guess: lastGuess,
//         }),
//       });

//       const data = await response.json();
//       const lastSegmentIndex = Math.min(attempts.length, AUDIO_SEGMENTS.length - 1);
//       const segmentDuration = AUDIO_SEGMENTS[lastSegmentIndex];

//       const resultData = {
//         name: data.correctName || '',
//         artists: data.artists || [],
//         timeToGuess: segmentDuration,
//         correct: false,
//         albumCover: data.albumCover,
//         segment: currentSegment,
//         trackId: tracks[currentTrackIndex].id
//       };

//       gameDispatch({ type: 'SET_CURRENT_RESULT', payload: resultData });
//       gameDispatch({ type: 'ADD_COMPLETED_TRACK', payload: resultData });

//     } catch (error) {
//       const lastSegmentIndex = Math.min(attempts.length, AUDIO_SEGMENTS.length - 1);
//       const segmentDuration = AUDIO_SEGMENTS[lastSegmentIndex];

//       const errorResult = {
//         name: "Erro ao carregar detalhes",
//         artists: ["Tente novamente mais tarde"],
//         timeToGuess: segmentDuration,
//         correct: false,
//         albumCover: undefined,
//         segment: currentSegment,
//         trackId: "error-" + Date.now()
//       };

//       gameDispatch({ type: 'SET_CURRENT_RESULT', payload: errorResult });
//       gameDispatch({ type: 'ADD_COMPLETED_TRACK', payload: errorResult });
//     }
//   };

//   const handleModalClose = () => {
//     uiDispatch({ type: 'TOGGLE_RESULT_MODAL', payload: false });
//     if (audioRef.current) {
//       audioRef.current.pause();
//     }
//     setTimeout(() => {
//       nextTrack();
//     }, 100);
//   };

//   const nextTrack = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//     audioDispatch({ type: 'PAUSE' });
//     searchDispatch({ type: 'RESET_SEARCH' });

//     if (currentTrackIndex + 1 < tracks.length) {
//       gameDispatch({ type: 'NEXT_TRACK' });
//     } else {
//       uiDispatch({ type: 'TOGGLE_RESULT_MODAL', payload: false });
//       uiDispatch({ type: 'TOGGLE_GAME_SUMMARY', payload: true });
//     }
//   };

//   useEffect(() => {
//     if (attempts.length >= 6 && !showResultModal) {
//       finishTrack();
//     }
//   }, [attempts.length, showResultModal]);

//   const handlePlayAgain = () => {
//     window.location.reload();
//   };

//   useEffect(() => {
//     gameDispatch({ type: 'RESET_TRACK' });
//     // Reset completedTracks when genre changes
//     gameState.completedTracks = [];
//   }, [genre]);

//   return (
//     <div className="grid grid-cols-2 gap-6">
//       <div className="col-span-2 grid grid-cols-2 gap-4">
//         {attempts.map((attempt, i) => (
//           <div
//             key={i}
//             className={`bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex items-center gap-3 ${attempt.skipped ? 'text-amber-500' : attempt.correct ? 'text-emerald-500' : 'text-red-500'
//               }`}
//           >
//             {attempt.skipped ? (
//               <>
//                 <SkipForward className="w-4 h-4" />
//                 <span className="tracking-[0.2em] text-sm">SKIPPED</span>
//               </>
//             ) : attempt.correct ? (
//               <span className="tracking-[0.2em] text-sm">CORRECT</span>
//             ) : (
//               <>
//                 <X className="w-4 h-4" />
//                 <span className="tracking-[0.2em] text-sm">WRONG</span>
//               </>
//             )}
//           </div>
//         ))}
//         {Array.from({ length: Math.max(0, 6 - attempts.length) }).map((_, i) => (
//           <div key={i} className="h-14 border border-dashed border-zinc-700 rounded-lg" />
//         ))}
//       </div>

//       <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-emerald-500">
//         <div className="text-sm font-medium mb-1">Current Stage</div>
//         <div className="text-2xl font-bold text-emerald-500">{currentSegment + 1} / {AUDIO_SEGMENTS.length}</div>
//       </div>

//       <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 text-emerald-500">
//         <div className="text-sm text-zinc-300">
//           <div className="text-sm font-medium mb-1 text-emerald-500">Segments</div>
//           {AUDIO_SEGMENTS.map((s, i) => (
//             <span key={i} className={`${i === currentSegment ? 'text-amber-400 font-bold' : ''} mx-1 text-xl`}>{s}s</span>
//           ))}
//         </div>
//       </div>

//       <div className="col-span-2 space-y-2">
//         <div className="h-2 w-full bg-zinc-700/50 rounded-full overflow-hidden">
//           <div
//             className="h-full bg-emerald-500"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//         <div className="flex justify-between text-xs text-zinc-300">
//           <span>0:00</span>
//           <span>0:30</span>
//         </div>
//       </div>

//       {tracks[currentTrackIndex] && (
//         <audio
//           ref={audioRef}
//           src={tracks[currentTrackIndex].preview_url}
//           onEnded={() => audioDispatch({ type: 'PAUSE' })}
//         />
//       )}

//       <div className="col-span-2 flex justify-center">
//         <Button
//           size="lg"
//           className={`w-16 h-16 rounded-full ${isPlaying
//             ? 'bg-amber-600 hover:bg-amber-700'
//             : 'bg-emerald-600 hover:bg-emerald-700'
//             } text-emerald-100`}
//           onClick={handlePlay}
//           disabled={!tracks[currentTrackIndex] || showResultModal}
//         >
//           {isLoading ? (
//             <Loader2 className="w-6 h-6 animate-spin" />
//           ) : isPlaying ? (
//             <div className="w-6 h-6 flex items-center justify-center">
//               <div className="w-2 h-6 bg-white rounded-sm mx-0.5"></div>
//               <div className="w-2 h-6 bg-white rounded-sm mx-0.5"></div>
//             </div>
//           ) : (
//             <Play className="w-6 h-6" />
//           )}
//         </Button>
//       </div>

//       <div className="col-span-2 flex justify-center mt-2">
//         <VolumeControl audioRef={audioRef} className="bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2" />
//       </div>

//       <div className="col-span-2 mt-4">
//         <div className="relative">
//           <Input
//             ref={inputRef}
//             placeholder="Enter the name of the song/artist"
//             value={searchQuery}
//             onChange={(e) => {
//               searchDispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
//               searchDispatch({ type: 'SET_GUESS', payload: e.target.value });
//               searchDispatch({ type: 'SET_SEARCH_ENABLED', payload: true });
//             }}
//             className="w-full"
//           />
//           {showSuggestions && suggestions.length > 0 && (
//             <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-600 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
//               <div className="py-1">
//                 {suggestions.map((suggestion) => (
//                   <div
//                     key={suggestion.id}
//                     className="px-2 py-2 cursor-pointer hover:bg-zinc-800 hover:text-zinc-100"
//                     onClick={() => {
//                       searchDispatch({ type: 'SET_SEARCH_ENABLED', payload: false });
//                       searchDispatch({ type: 'SET_SEARCH_QUERY', payload: suggestion.name });
//                       searchDispatch({ type: 'SET_GUESS', payload: suggestion.name });
//                       searchDispatch({ type: 'TOGGLE_SUGGESTIONS', payload: false });
//                       searchDispatch({ type: 'SET_SUGGESTIONS', payload: [] });
//                     }}
//                   >
//                     <div className="flex flex-col">
//                       <span className="font-medium text-zinc-100">{suggestion.name}</span>
//                       <span className="text-sm text-zinc-400">
//                         {suggestion.artists}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <Button
//         variant="outline"
//         className="flex-1 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
//         onClick={handleSkip}
//         disabled={attempts.length >= 6 || showResultModal}
//       >
//         SKIP
//       </Button>
//       <Button
//         className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-emerald-100"
//         onClick={handleSubmit}
//         disabled={attempts.length >= 6 || showResultModal || !guess.trim()}
//       >
//         Submit
//       </Button>

//       <GameResultDialog
//         open={showResultModal}
//         onOpenChange={(open) => uiDispatch({ type: 'TOGGLE_RESULT_MODAL', payload: open })}
//         result={currentResult}
//         onNext={handleModalClose}
//         segmentsLength={AUDIO_SEGMENTS.length}
//       />

//       <GameSummaryDialog
//         open={showGameSummary}
//         onOpenChange={(open) => uiDispatch({ type: 'TOGGLE_GAME_SUMMARY', payload: open })}
//         completedTracks={completedTracks}
//         segmentsLength={AUDIO_SEGMENTS.length}
//         onPlayAgain={handlePlayAgain}
//       />
//     </div>
//   )
// }

