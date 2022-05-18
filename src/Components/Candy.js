import {useEffect, useState} from 'react';
import './Candy.css';
import Scores from './Scores';
import blue from './images/bluef.jpg';
import red from './images/redf.jpg';
import green from './images/greenf.jpg'
import purple from './images/purplef.png'
import orange from './images/orangef.jpg'
import yellow from './images/yellowf.jpg'
import blank from './images/blank.jpg';



  const width = 8 
  const candyColors = [
     blue,
    green,
    orange,
    purple,
    red,
    yellow, 
    
  ]

  const Candy = () => {

    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                columnOfFour.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArrangement[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                rowOfFour.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                columnOfThree.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentColorArrangement[i]
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                rowOfThree.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                currentColorArrangement[i] = candyColors[randomNumber]
            }

            if ((currentColorArrangement[i + width]) === blank) {
                currentColorArrangement[i + width] = currentColorArrangement [i]
                currentColorArrangement[i] = blank
            }
        }
    }

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }
    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        } else {
            currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArrangement([...currentColorArrangement])
        }
    }


    const createBoard = () => {
        const randomColorArrangement = []
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }

    useEffect(() => {
        createBoard()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])


    return (
        <div className="candy-crush">
            <div className="game">
                {currentColorArrangement.map((candyColor, index) => (
                    <img
                        key={index}
                        src={candyColor}
                        alt={candyColor}
                        data-id={index}
                        draggable={true}
                        onDragStart={dragStart}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                    />
                ))}
            </div>
            <Scores score={scoreDisplay}/>
            </div>
            )

//     const [currentColorArrangement, setCurrentColorArrangement] = useState([])

//     const [squareBeingDragged, setSquareBeingDragged] = useState(null)
//     const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
  

//     const checkForColumnofFour = () => {
//       for (let i = 0; i <= 39; i++) {

//         const columnOfFour = [i, i +width, i + width * 2 , i + width *3]
//         const decidedrColor = currentColorArrangement[i]

//         if (columnOfFour.every(square => currentColorArrangement[square] === decidedrColor)) {
//           columnOfFour.forEach(square => currentColorArrangement[square] = '')
//           return true

//         }
//       }
//     }


//     const checkForRowofFour = () => {
//       for (let i = 0; i <= 55; i++) {

//         const rowOfFour = [i, i + 1, i + 2 , i + 3]
//         const decidedrColor = currentColorArrangement[i]
//         const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]

//         if (notValid.includes(i)) continue

//         if (rowOfFour.every(square => currentColorArrangement[square] === decidedrColor)) {
//           rowOfFour.forEach(square => currentColorArrangement[square] = '')
//           return true
          

//         }
//       }
//     }


//     const checkForColumnofThree = () => {
//       for (let i = 0; i <= 47; i++) {
//         const columnOfThree = [i, i +width, i + width * 2]
//         const decidedrColor = currentColorArrangement[i]

//         if (columnOfThree.every(square => currentColorArrangement[square] === decidedrColor)) {
//           columnOfThree.forEach(square => currentColorArrangement[square] = '')
//           return true

//         }
//       }
//     }

//     const checkForRowofThree = () => {
//       for (let i = 0; i < 64;  i++) {

//         const rowOfThree = [i, i + 1, i  + 2]
//         const decidedrColor = currentColorArrangement[i]
//         const notValid = [6, 7, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

//         if (notValid.includes(i)) continue

//         if (rowOfThree.every(square => currentColorArrangement[square] === decidedrColor)) {
//           rowOfThree.forEach(square => currentColorArrangement[square] = '')
//           return true

//         }
//       }
//     }



//     const moveIntoSquareBelow = () => {
//       for (let i = 0; i <= 55 - width; i++ ) {
//         const firstRow = [0, 1, 2, 3,4, 5, 6, 7]
//         const isFirstRow = firstRow.includes(i)

//         if(isFirstRow && currentColorArrangement[i] === '') {
//         let randomNumber =  Math.floor(Math.random() * candyColor.length)
//         currentColorArrangement[i] = candyColor[randomNumber]
//         }


//         if ((currentColorArrangement[i + width]) === '') {
//           currentColorArrangement[i + width] = currentColorArrangement[i]
//           currentColorArrangement[i] = ''
//         }
//       }
//     }


//     const dragStart = (e) => {
//       console.log('drag start');
//       setSquareBeingDragged(e.TARGET)

//     }

//     const dragDrop = (e) => {
//       console.log('drag drop');
//       setSquareBeingReplaced(e.target)

//     }


//     const dragEnd = () => {
//       console.log('drag end');
//       const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
//       const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

//       currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
//       currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

//       const validMoves = [
//         squareBeingDraggedId -1,
//         squareBeingDraggedId - width,
//         squareBeingDraggedId + 1,
//         squareBeingDraggedId -width

//       ]

//       const validMove = validMoves.includes(squareBeingDraggedId)

      
//       const isAColumnOfFour = checkForColumnofFour()
//       const isARowOfFour = checkForRowofFour()
//       const isAColumnOfThree = checkForColumnofThree()
//       const isARowOfThree = checkForRowofThree()

//       if (squareBeingReplacedId &&
//         validMove &&
//         (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
//         setSquareBeingDragged(null)
//         setSquareBeingReplaced(null)
//     } else {
//         currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
//         currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
//         setCurrentColorArrangement([...currentColorArrangement])
//     }

//     }

//     const createBoard = () => {
//       const randomColorArrangement = []
//       for (let i = 0; i < width * width ; i++) {
//         const randomColor = candyColor[Math.floor(Math.random() * candyColor.length)]
//         randomColorArrangement.push(randomColor)
//       }
//       setCurrentColorArrangement(randomColorArrangement);
//     }
    
//     useEffect(() => {
//     createBoard()   

//     } ,[])

//     useEffect (() => {
//       const timer = setInterval(() => {
//         checkForColumnofFour()
//         checkForRowofFour()
//         checkForColumnofThree()
//         checkForRowofThree()
//         moveIntoSquareBelow()
//         setCurrentColorArrangement([...currentColorArrangement])
//       }, 100 )
      
//       return () => clearInterval(timer)

// }, 
// [checkForColumnofFour, checkForRowofFour, checkForColumnofThree,checkForRowofThree, moveIntoSquareBelow, currentColorArrangement])

  
//     return (
//     <div className='color'>
//       <div className='game'>
//         {currentColorArrangement.map((candyColor , index) => (

        
//         <img 
//         key= {index}
//         src={candyColor}
//         // style={{backgroundColor: candyColor}}
//         alt={candyColor}
//         data-id ={index}

//         draggable={true}
//                         onDragStart={dragStart}
//                         onDragOver={(e) => e.preventDefault()}
//                         onDragEnter={(e) => e.preventDefault()}
//                         onDragLeave={(e) => e.preventDefault()}
//                         onDrop={dragDrop}
//                         onDragEnd={dragEnd}

//         />
//         ))}

//       </div>
//     </div>
//   )
}

export default Candy;