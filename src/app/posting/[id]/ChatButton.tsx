'use client';

export default function ChatButton(){
    const btnStyle = `
  text-white 
  text-base 
  px-4 py-2 
  bg-blue-600 
  rounded-md 
  hover:bg-blue-700 
  focus:ring-2 focus:ring-blue-400 
  transition 
  duration-200 
  ease-in-out 
  shadow-sm
`;
    return <div>
        <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
            <button type="button" onClick={handleChat} className={btnStyle}>
                Message Now!
            </button>
        </a>
    </div>
}

function handleChat() {
    // Handle chat button click
    console.log("Chat button clicked");
}