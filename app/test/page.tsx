'use client'
import { useState, useEffect } from 'react'

export default function TestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log(email, password)
  }

  useEffect(() => {
    if (email === '33333') {

    }
  }, [email])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', border: '1px solid red', padding: '10px' }}>
        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  style={{ border: '1px solid blue' }}/>
        <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  style={{ border: '1px solid blue' }}/>
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>
    </div>
  )
}