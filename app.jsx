import { useState } from 'react'

const motSecret = 'BANANE'

function App() {
  const [lettresDevinees, setLettresDevinees] = useState([])
  const [erreurs, setErreurs] = useState([])

  const handleGuess = (e) => {
    e.preventDefault()
    const lettre = e.target.elements.lettre.value.toUpperCase()
    e.target.reset()

    if (lettresDevinees.includes(lettre) || erreurs.includes(lettre)) return

    if (motSecret.includes(lettre)) {
      setLettresDevinees([...lettresDevinees, lettre])
    } else {
      setErreurs([...erreurs, lettre])
    }
  }

  const motAffiche = motSecret
    .split('')
    .map((l) => (lettresDevinees.includes(l) ? l : '_'))
    .join(' ')

  const estGagné = motSecret.split('').every((l) => lettresDevinees.includes(l))

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 Jeu du mot à deviner</h1>
      <p style={{ fontSize: '2em' }}>{motAffiche}</p>
      {estGagné ? (
        <h2>Bravo Franck ! Tu as trouvé le mot !</h2>
      ) : (
        <>
          <form onSubmit={handleGuess}>
            <input name="lettre" maxLength="1" required />
            <button>Deviner</button>
          </form>
          <p>Erreurs : {erreurs.join(', ')}</p>
        </>
      )}
    </div>
  )
}

export default App
