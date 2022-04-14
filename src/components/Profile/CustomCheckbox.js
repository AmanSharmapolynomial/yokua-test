import React, { useEffect, useRef } from 'react'

const CustomCheckbox = ({ info, setCheckedIds, index, checkedIds }) => {
  const inputCheckRef = useRef()

  useEffect(() => {
    if (info.subscribed) {
      inputCheckRef.current.checked = true
    }
  }, [])

  return (
    <div className={'edit_sales-news'}>
      <input
        className="w-auto"
        type="checkbox"
        id={'check' + index}
        ref={inputCheckRef}
        // make proper system for checking and unchcking acc to backedn
        onChange={e => {
          const tempArr = checkedIds
          if (e.target.checked) {
            const checkedPayload = {
              id: info.id,
              subscribed: true,
              news_letter_title: info.news_letter_title,
            }
            tempArr.push(checkedPayload)
          } else {
            const checkedPayload = {
              id: info.id,
              subscribed: true,
            }
            tempArr.map((ci, index) => {
              if (ci.id == info.id) {
                tempArr.splice(index, 1)
              }
            })
          }

          checkedIds.map((ci, index) => {
            let checkingBox = true
            tempArr.map((ti, ind) => {
              if (ti.id == ci.id) {
                checkingBox = false
              }
            })
            if (checkingBox) {
              return
            } else {
              setCheckedIds(tempArr)
            }
          })
        }}
      />
      <label htmlFor="check1">{info.news_letter_title}</label>
    </div>
  )
}

export default CustomCheckbox
