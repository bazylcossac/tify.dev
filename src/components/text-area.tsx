import React from "react";
import { Textarea } from "./ui/textarea";

function TextAreaComponent() {
  return (
    <div>
      <div className="flex items-center bg-[#161616] p-4 rounded-xl w-3/4 my-6 mx-2">
        <Textarea
          className="no-scrollbar overflow-y-auto rounded-xl border-none resize-none placeholder:text-white/60 placeholder:font-semibold h-[30px]"
          placeholder="Whats happening?"
        />
      </div>
    </div>
  );
}

export default TextAreaComponent;
