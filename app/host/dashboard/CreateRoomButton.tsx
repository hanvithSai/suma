"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoomAction } from "@/app/actions/room";
import { Plus, Loader2 } from "lucide-react";

export function CreateRoomButton() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const result = await createRoomAction();
      if (result.error) {
        setError(result.error);
        setIsCreating(false);
      } else if (result.code) {
        router.push(`/${result.code}`);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          {error}
        </div>
      )}

      <button 
        onClick={handleCreateRoom}
        disabled={isCreating}
        className="btn btn-primary py-4 mt-4 w-full flex justify-center items-center gap-2 hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] transition-shadow"
      >
        {isCreating ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span>Create Room</span>
          </>
        )}
      </button>
    </div>
  );
}
