// App.jsx
import { useRef, useState, useEffect } from 'react'
import './App.css'
import TimeSince from '../components/timer'
import song from './assets/coffee.mp3'
import Polaroid from '../components/polaroid'

// images
import CoffeeDate from './assets/coffeeDate.jpeg'
import GridLisa from './assets/gridLisa.jpeg'
import GridMeLisa from './assets/gridMeLisa.jpeg'
import GridMeLisaTwo from './assets/gridMeLisaTwo.jpeg'
import LisaMeDate from './assets/lisaMeDate.jpeg'
import LisaMeMOA from './assets/lisaMeMOA.jpeg'
import LisaPlushy from './assets/lisaPlushy.jpeg'
import LisaSleeping from './assets/lisaSleeping.jpeg'
import TomLizard from './assets/tomLizard.jpeg'
import Stalker from './assets/stalker.jpeg'
import Pictures from './assets/pictures.jpeg'
import HoldingHands from './assets/holdingHands.jpeg'
import BigBacks from './assets/bigBack.jpeg'
import BreadInit from './assets/breadInit.jpeg'
import Twin from './assets/twin.jpeg'
import Tentacles from './assets/tentacles.jpeg'
import DateOne from './assets/dateone.jpeg'
import DateTwo from './assets/datetwo.jpeg'
import DayAfter from './assets/after.jpeg'
import TimeTogether from '../components/together'




function App() {
  const noRef = useRef(null)
  const wrapperRef = useRef(null)
  const audioRef = useRef(null)
  const [answered, setAnswered] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const startMusic = () => {
      if (audioRef.current && !playing) {
        audioRef.current.play()
        setPlaying(true)
      }
    }
    window.addEventListener('click', startMusic, { once: true })
    window.addEventListener('scroll', startMusic, { once: true })
    return () => {
      window.removeEventListener('click', startMusic)
      window.removeEventListener('scroll', startMusic)
    }
  }, [playing])

  const runAway = () => {
    const btn = noRef.current
    const wrapper = wrapperRef.current
    if (!btn || !wrapper) return
    if (!hasRun) {
      const wRect = wrapper.getBoundingClientRect()
      const bRect = btn.getBoundingClientRect()
      btn.style.position = 'absolute'
      btn.style.left = `${bRect.left - wRect.left}px`
      btn.style.top  = `${bRect.top  - wRect.top}px`
      setHasRun(true)
    }
    const wRect = wrapper.getBoundingClientRect()
    const bRect = btn.getBoundingClientRect()
    const maxX = wRect.width  - bRect.width
    const maxY = wRect.height - bRect.height
    btn.style.left = `${Math.random() * maxX}px`
    btn.style.top  = `${Math.random() * maxY}px`
  }

  return (
    <>
      <audio ref={audioRef} src={song} loop />

      {/* small mute toggle in the corner */}
      <button
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted
            setPlaying(p => !p)
          }
        }}
        style={{
          position: 'fixed', bottom: 16, right: 16, zIndex: 999,
          background: 'rgba(255,255,255,0.7)', border: '1px solid #e8b4c8',
          borderRadius: '999px', padding: '6px 14px', cursor: 'pointer',
          fontSize: 13, color: '#d4537e', backdropFilter: 'blur(4px)'
        }}
      >
        {playing ? '♪ music on' : '♪ music off'}
      </button>

      <div id='hero'>
        <p id='scroll-down'>scroll down</p>
        <p id='scroll-down-arrow'>↓</p>
      </div>

      <div id='content'>
        <TimeSince />
        <TimeTogether/>
        <p id='intro'>So yea I've got a few things I've got to tell ya…</p>
        <p className='letter-body'>
          You are a beautiful woman, not a girl not a female or any other term, you are a beautiful woman.
          You say that I bring out the girl's girl out of you which makes me happy ( you make me happy ).
          You make me want to push myself a lot more so that I can give you the world you want, a world
          which I'd want to be a part of. Be it us driving a Porsche, or us just traveling the world
          together — either way you make me want to be more and do more.
        </p>
        <p className='letter-body'>
          Each mini date we had made me happy, made me think "you know what? Maybe this is the one" —
          and I really do hope you are. So, Lisa Tadhliwa…
        </p>
        <p className='letter-body' style={{ fontStyle: 'italic', fontSize: 17 }}>
          will you be my girlfriend?
        </p>
        {!answered ? (
          <div className='choice-wrapper' ref={wrapperRef}>
            <button className='btn-yes' onClick={() => setAnswered(true)}>yes ♥</button>
            <button className='btn-no' ref={noRef} onMouseEnter={runAway}>no</button>
          </div>
        ) : (
          <p style={{ color: '#d4537e', fontStyle: 'italic', fontSize: 17, margin: '1.6rem 0' }}>
            You are stuck with me now 🥹♥
          </p>
        )}


        <p id='love-para' className='letter-body'>
          Also — this gives me the opportunity to say the three words I've been meaning to say to you
          for the longest yoh...but any ways Mrs President, 
        </p>
        <span id='love-highlight'>I love you ❤️</span>
      </div>

      <div id="gallery">

        <div>
          <h1>Our Gallery</h1>
          <p>
            every moment with you feels good, every moment with you makes me happy, i may not be the best but i will most definitely try my best, as i said before i want to give you the world, and a world i can live in with you. <br />
            trust and believe that i always want to ( just tell me lil nigga, i am not some psychic). <br />
            i'm glad i met you, and i love you !
            <br /><br />
            p.s this gallery needs to be filled to the brim, so more pictures please. 
          </p>
        </div>
        
  <Polaroid
    image={CoffeeDate}
    date="03/03"
    caption="Got coffee"
  />

  <Polaroid
    image={GridLisa}
    date="13/03"
    caption="Fine babes"
  />

  <Polaroid
    image={GridMeLisa}
    date="20/03"
    caption="Could only see you for an hour"
  />

  <Polaroid
    image={GridMeLisaTwo}
    date="20/03"
    caption="I just cant get over you"
  />


  <Polaroid
    image={LisaPlushy}
    date="22/03"
    caption="Study break w little old me"
  />

  <Polaroid
    image={LisaSleeping}
    date="22/03"
    caption="Yea, I just like looking at you"
  />

  <Polaroid
    image={TomLizard}
    date="28/03"
    caption="My favourite person"
  />

  <Polaroid
    image={Stalker}
    date="28/03"
    caption="I think I got a stalker..."
  />

  <Polaroid
    image={LisaMeDate}
    date="02/04"
    caption="Went to Dappao"
  />

  <Polaroid
    image={HoldingHands}
    date="08/04"
    caption="I could hold you forever"
  />

  <Polaroid
    image={Pictures}
    date="08/04"
    caption="Finally got actual pictures"
  />

  <Polaroid
    image={BigBacks}
    date="17/04"
    caption="Big Backs"
  />

  <Polaroid
    image={BreadInit}
    date="19/04"
    caption="Bread Init"
  />

  <Polaroid
    image={Twin}
    date="19/04"
    caption="'sup twin"
  />
  
  <Polaroid
    image={Tentacles}
    date="19/04"
    caption="'Tentacle twin'"
  />

  <Polaroid
    image={DateOne}
    date="19/04"
    caption="We off the market!"
  />

  <Polaroid
    image={DateTwo}
    date="02/05"
    caption="funny mirror"
  />

  <Polaroid
    image={DayAfter}
    date="02/05"
    caption="Shes my girlfriend!"
  />
</div>
    </>
  )
}

export default App