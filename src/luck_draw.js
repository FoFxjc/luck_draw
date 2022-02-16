import { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  DialogTitle,
} from '@material-ui/core'
import Card from './card'
import './app.scss'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { default as MCard } from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import TextLoop from 'react-text-loop'
import Typography from '@mui/material/Typography'
import luckdraw_bg from './images/luck_draw_bg.jpeg'
import go_button from './images/button_3.png'
import show_price_button from './images/show_price_button.png'
import sort_button from './images/sort_button.png'
// import tiger_pic_0 from './images/tiger_pic_0.png'
// import tiger_pic_1 from './images/tiger_pic_1.png'
// import tiger_pic_2 from './images/tiger_pic_2.png'
// import tiger_pic_3 from './images/tiger_pic_3.png'
// import tiger_pic_4 from './images/tiger_pic_4.png'
// import tiger_pic_5 from './images/tiger_pic_5.png'
// import tiger_pic_6 from './images/tiger_pic_6.png'
// import tiger_pic_7 from './images/tiger_pic_7.png'

const uniqueElementsArray = []

const people = [
  'Peter',
  'Kok Ping',
  'Hui Min',
  'Era',
  'Simson',
  'Muthu',
  'Kamal',
  'Corn',
  'Jignesh',
  'Sathiya',
  'Sathappan',
  'Palani',
  'Ramya',
  'Shoba',
  'Rupali',
  'Vaithess',
  'Ashok',
  'Anban',
  'Nand',
  'Pani',
  'Priya',
  'Raj',
  'Mani',
  'Satheesh',
  'Ariv',
]

let images = importAll(require.context('./images/tiger_pics', false, /\.png/))

for (const property in images) {
  uniqueElementsArray.push({
    type: property.replace('./', ''),
    image: images[property],
    index: Number(property.replace('./', '').split('_').at(-2)),
    price: Number(property.replace('./', '').split('_').at(-1)),
  })
}

console.log(uniqueElementsArray)

function importAll(r) {
  let images = {}
  r.keys().map((item, index) => {
    images[item.replace('./images/tiger_pics', '').replace('.png', '')] =
      r(item).default
  })
  return images
}

function shuffleCards(array) {
  const length = array.length
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i)
    const currentIndex = i - 1
    const temp = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temp
  }
  return array
}
export default function LuckDraw() {
  const [cards, setCards] = useState(
    shuffleCards.bind(null, uniqueElementsArray.concat(uniqueElementsArray))
  )
  const [openCards, setOpenCards] = useState([])
  const [clearedCards, setClearedCards] = useState({})
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false)
  const [moves, setMoves] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [bestScore, setBestScore] = useState(
    JSON.parse(localStorage.getItem('bestScore')) || Number.POSITIVE_INFINITY
  )
  const timeout = useRef(null)

  const [start, setStart] = useState(false)

  const [remainPeople, setRemainPeople] = useState(people)

  const [thisRoundRemainPeople, setThisRoundRemainPeople] = useState(people)

  const [round, setRound] = useState(1)

  const [currentPerson, setCurrentPerson] = useState(null)

  const [showPrice, setShowPrice] = useState(false)

  const [priceList, setpriceList] = useState([])

  const [debug, setDebug] = useState(false)

  const [tryTime, setTryTime] = useState(0)

  const disable = () => {
    setShouldDisableAllCards(true)
  }
  const enable = () => {
    setShouldDisableAllCards(false)
  }

  const startLoop = () => {
    setCurrentPerson(null)
    setStart(true)
  }

  const endLoop = () => {
    let winner = getWinner()
    setCurrentPerson(winner)

    setStart(false)
  }

  const getWinner = () => {
    //根据随机数找到当前的中奖者
    let wIndex = GetRandom(0, thisRoundRemainPeople.length)
    let winner = thisRoundRemainPeople[wIndex]

    return winner
  }

  const GetRandom = (Min, Max) => {
    //随机数
    return Min + Math.floor(Math.random() * (Max - Min))
  }

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueElementsArray.length) {
      setShowModal(true)
      const highScore = Math.min(moves, bestScore)
      setBestScore(highScore)
      localStorage.setItem('bestScore', highScore)
    }
  }
  const evaluate = () => {
    const [first, second] = openCards
    enable()
    if (cards[first].type === cards[second].type) {
      setClearedCards((prev) => ({ ...prev, [cards[first].type]: true }))
      setOpenCards([])
      let _priceList = [...priceList]
      _priceList.push({
        person: currentPerson,
        card: cards[second],
      })
      console.log(_priceList)
      setpriceList(_priceList)
      let _remainPeople = [...remainPeople].filter((item) => {
        return item != currentPerson
      })
      setRemainPeople(_remainPeople)
      let _thisRoundRemainPeople = [...thisRoundRemainPeople].filter((item) => {
        return item != currentPerson
      })

      if (_thisRoundRemainPeople.length === 0) {
        setThisRoundRemainPeople(_remainPeople)

        setRound(round + 1)
        setTimeout(() => {
          setCurrentPerson(null)
          // setCards(shuffleCards(cards.concat(cards)))
        }, 1000)
      } else {
        setThisRoundRemainPeople(_thisRoundRemainPeople)
        setTimeout(() => {
          setCurrentPerson(null)
        }, 1000)
      }

      return
    }
    // This is to flip the cards back after 500ms duration

    let _thisRoundRemainPeople = [...thisRoundRemainPeople].filter((item) => {
      return item != currentPerson
    })

    if (_thisRoundRemainPeople.length === 0) {
      setThisRoundRemainPeople([...remainPeople])
      setRound(round + 1)
      timeout.current = setTimeout(() => {
        setOpenCards([])
        setCurrentPerson(null)
        // setCards(shuffleCards(cards.concat(cards)))
      }, 500)
    } else {
      if (round <= 2) {
        if (tryTime + 1 > 1) {
          timeout.current = setTimeout(() => {
            setCurrentPerson(null)
            setThisRoundRemainPeople(_thisRoundRemainPeople)
            setTryTime(0)
          }, 2000)
        }
        setTryTime(tryTime + 1)
      } else {
        timeout.current = setTimeout(() => {
          setCurrentPerson(null)
          setThisRoundRemainPeople(_thisRoundRemainPeople)
          setTryTime(0)
        }, 2000)
      }

      timeout.current = setTimeout(() => {
        setOpenCards([])
      }, 2000)
    }
  }
  const handleCardClick = (index) => {
    if (currentPerson) {
      if (openCards.length === 1) {
        setOpenCards((prev) => [...prev, index])
        setMoves((moves) => moves + 1)
        disable()
      } else {
        clearTimeout(timeout.current)
        setOpenCards([index])
      }
    }
  }

  useEffect(() => {
    let timeout = null
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [openCards])

  useEffect(() => {
    console.log(clearedCards)
    checkCompletion()
  }, [clearedCards])
  const checkIsFlipped = (index) => {
    if (debug) {
      return true
    } else {
      return openCards.includes(index)
    }
  }

  const checkIsInactive = (card) => {
    return Boolean(clearedCards[card.type])
  }

  const handleRestart = () => {
    setClearedCards({})
    setOpenCards([])
    setShowModal(false)
    setMoves(0)
    setShouldDisableAllCards(false)
    // set a shuffled deck of cards
    setCards(shuffleCards(uniqueElementsArray.concat(uniqueElementsArray)))
  }

  return (
    <div className="App">
      <Grid container spacing={2} className="header_container">
        <Grid
          item
          md={12}
          style={{
            background: 'transparent',
          }}
        >
          <div className="bg_title"></div>
        </Grid>
        {/* <Grid item md={3}>
          <Paper
            elevation={0}
            style={{
              height: '100%',
              paddingLeft: '0px',
              paddingTop: '20px',
              backgroundColor: 'transparent',
            }}
          >
            <Typography
              variant="h4"
              component="div"
              gutterBottom
              style={{ color: 'rgb(248, 197, 69)', fontWeight: 'bold' }}
            >
              Round {round}
            </Typography>
          </Paper>
        </Grid> */}
      </Grid>
      <Grid container spacing={5} className="container">
        <Grid item md={9}>
          <Paper className="game_board" elevation={3}>
            {cards.map((card, index) => {
              return (
                <Card
                  key={index}
                  card={card}
                  index={index}
                  isDisabled={shouldDisableAllCards}
                  isInactive={checkIsInactive(card)}
                  isFlipped={checkIsFlipped(index)}
                  onClick={handleCardClick}
                />
              )
            })}
          </Paper>
        </Grid>
        <Grid item md={3}>
          <Paper
            elevation={0}
            style={{
              height: '40px',
              paddingLeft: '0px',
              paddingTop: '0px',
              backgroundColor: 'transparent',
            }}
          >
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              style={{ color: 'rgb(248, 197, 69)', fontWeight: 'bold' }}
            >
              Round {round}
            </Typography>
          </Paper>
          <Paper
            className="price_board"
            elevation={3}
            style={{
              maxHeight: '580px',
              minHeight: '580px',
              overflow: 'auto',
            }}
          >
            <Stack
              spacing={1}
              divider={<Divider flexItem />}
              style={{ padding: '10px 15px 15px 15px' }}
            >
              {priceList.length !== 0 ? (
                priceList.map((claredCard, index) => {
                  // let _target_card = uniqueElementsArray.filter((obj) => {
                  //   return obj.type === claredCard_index
                  // })[0]
                  let _target_card = claredCard
                  return (
                    <Paper elevation={1} className="card-price">
                      <CardContent>
                        <Grid
                          container
                          spacing={1}
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                          }}
                        >
                          <Grid item md={3}>
                            <img
                              className="card-face-price"
                              src={_target_card.card['image']}
                            />
                          </Grid>
                          <Grid
                            item
                            md={7}
                            style={{
                              marginTop: '-10px',
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="span"
                              gutterBottom
                              style={{
                                width: '80px',
                                marginLeft: '25px',
                                fontSize: '20px',
                                color: 'white',
                              }}
                            >
                              {_target_card.person}
                            </Typography>
                          </Grid>
                          {showPrice ? (
                            <Grid
                              item
                              md={1}
                              style={{
                                marginTop: '-10px',
                              }}
                            >
                              <Typography
                                variant="h6"
                                component="span"
                                gutterBottom
                                style={{
                                  width: '50px',
                                  fontSize: '20px',
                                  color: 'white',
                                  textShadow:
                                    '2px 0 rgb(248, 197, 69), -2px 0 rgb(248, 197, 69), 0 2px rgb(248, 197, 69), 0 -2px rgb(248, 197, 69), 1px 1px rgb(248, 197, 69), -1px -1px rgb(248, 197, 69), -1px 1px rgb(248, 197, 69), 1px -1px rgb(248, 197, 69)',
                                }}
                              >
                                S${_target_card.card['price']}
                              </Typography>
                            </Grid>
                          ) : (
                            <></>
                          )}
                        </Grid>
                      </CardContent>
                    </Paper>
                  )
                })
              ) : (
                <></>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} className="footer_container">
        <Grid item md={4} />
        <Grid item md={2} className="person_list_wrapper">
          <Paper elevation={0} className="person_list_container">
            {!start ? (
              <Typography
                variant="h5"
                component="div"
                gutterBottom
                style={{
                  width: '100px',
                  color: 'rgb(248, 197, 69)',
                  marginTop: '-5px',
                  marginLeft: '-5px',
                }}
              >
                {currentPerson}
              </Typography>
            ) : (
              <TextLoop interval={[80, 100]}>
                {thisRoundRemainPeople.map((person, index) => {
                  return (
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      style={{
                        width: '100px',
                        color: 'rgb(248, 197, 69)',
                        marginTop: '-5px',
                        marginLeft: '-5px',
                      }}
                    >
                      {person}
                    </Typography>
                  )
                })}
              </TextLoop>
            )}
          </Paper>
        </Grid>

        <Grid item md={3}>
          <Paper
            elevation={0}
            style={{
              height: '100%',
              marginTop: '-20px',
              background: 'transparent',
            }}
          >
            <Stack spacing={2} direction="row">
              {!start ? (
                <img
                  src={go_button}
                  onClick={startLoop}
                  className="go_button"
                ></img>
              ) : (
                // <Button variant="contained" onClick={startLoop}>
                //   Start
                // </Button>
                <img
                  src={go_button}
                  onClick={endLoop}
                  className="go_button"
                ></img>
              )}

              {/* <Button
                variant="contained"
                onClick={() => {
                  setDebug(!debug)
                }}
              >
                Debug
              </Button> */}
              <img
                src={show_price_button}
                onClick={() => {
                  setShowPrice(!showPrice)
                }}
                className="price_button"
              ></img>
              {remainPeople.length === 0 ? (
                <img
                  src={sort_button}
                  onClick={() => {
                    let _priceList = [...priceList]
                    _priceList = _priceList.sort((a, b) =>
                      a.card.price < b.card.price ? 1 : -1
                    )
                    setpriceList(_priceList)
                    //下载为json文件
                    var Link = document.createElement('a')
                    Link.download = 'luck_draw_final_data.json'
                    Link.style.display = 'none'
                    // 字符内容转变成blob地址
                    var data = JSON.stringify(_priceList, undefined, 4)
                    var blob = new Blob([data], { type: 'text/json' })
                    Link.href = URL.createObjectURL(blob)
                    // 触发点击
                    document.body.appendChild(Link)
                    Link.click()
                    // 然后移除
                    document.body.removeChild(Link)
                  }}
                  className="go_button"
                ></img>
              ) : (
                <></>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={showModal}
        disableBackdropClick
        disableEscapeKeyDown
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hurray!!! You completed the challenge
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You completed the game in {moves} moves. Your best score is{' '}
            {bestScore} moves.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRestart} color="primary">
            Restart
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
