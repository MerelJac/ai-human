import React from 'react';
import logo from '../../robot.png';
import Post from '../posts/Post';

export default function Sidebar({chatContent, handleChatClick, setChatId, setChatboxContent, user}) {


    const triggerNewChat = () => {
        setChatId("")
    }

  return (
    <div className='flex flex-col'>
      <section className='flex items-center justify-between pb-4'>
        <div className='flex items-center'>
          <img className='w-[5vw]' alt='logo' src={logo} />
          <h2 className='ml-2'>New Chat</h2>
        </div>
        <div>
        <p className="text-teal-500" onClick={triggerNewChat}>+</p>
        </div>
      </section>

      <section>
        <article>
        <p>Your recent chats</p>
        {/* <Post url={`/api/chats/user/${user?.id}`}/> */}
        <Post email={user.email} apiCall={"post"} content={chatContent} handleChatClick={handleChatClick} url={`/api/chats/user/${user.email}`}/>
        </article>
        <article>
        <p>Your shared chats</p>
        <Post apiCall={"get"}content={chatContent} handleChatClick={handleChatClick} url={`/api/chats/share`}/>
        </article>

      </section>
    </div>
  );
}
