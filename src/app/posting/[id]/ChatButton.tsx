'use client';

export default function ChatButton(){
    return <div>
        <button type="button" onClick={handleChat} className="bg-blue-500 text-white px-4 py-2 rounded">
            Message Now!
        </button>
    </div>
}

function handleChat() {
    // Handle chat button click
    console.log("Chat button clicked");
}