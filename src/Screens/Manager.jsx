import logo from '../assets/images/kayser_logo.webp'
import user from "../assets/gif/user.gif"
import { useState } from 'react';
import gif from "../assets/gif/password.gif"

const Manager = () => { 
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = () => {}

    return (
        <>
            <div className="flex items-center justify-center min-h-[98svh] md:min-h-[90svh] mt-[-100px]">
                <div className="card bg-base-300 w-96 shadow-2xl">
                    <figure>
                        <img
                            src={logo}
                        />
                    </figure>
                    <div className="card-body">
                        <form className="flex flex-col items-center" action="" onSubmit={handleSubmit}>
                            <div className="w-full relative">
                                <label className="input validator w-full">
                                    <img src={user} alt="" width={20} height={20}/>
                                    <input
                                        className='w-full'
                                        type="input"
                                        required
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                    />
                                </label>
                                <p className="validator-hint">
                                    Complet the username
                                </p>
                            </div>
                            <div className="w-full relative ">
                                <label className="input validator w-full">
                                    <img src={gif} alt="" width={20} height={20}/>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Password"
                                        minLength="8"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </label>
                                <p className="validator-hint hidden">
                                    Complet the password
                                </p>
                            </div>
                                <button className="btn btn-soft btn-error btn-block mt-2" type="submit" >LogIn</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
 }

 export default Manager