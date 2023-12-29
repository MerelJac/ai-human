import React, { useContext } from 'react';
import logo from '../../robot.png';
import Post from '../posts/Post';
import { AuthContext } from '../../App';

export default function Sidebar() {
    const {user} = useContext(AuthContext)
  return (
    <div className='flex flex-col'>
      <section className='flex items-center justify-between pb-4'>
        <div className='flex items-center'>
          <img className='w-[5vw]' alt='logo' src={logo} />
          <h2 className='ml-2'>New Chat</h2>
        </div>
        <div>
        <p className="text-teal-500">+</p>
        </div>
      </section>

      <section>
        <article>
        <p>Your recent chats</p>
        {/* <Post url={`/api/chats/user/${user?.id}`}/> */}
        <Post url={`/api/chats/`}/>
        </article>
        <article>
        <p>Your shared chats</p>
        </article>

      </section>
    </div>
  );
}
