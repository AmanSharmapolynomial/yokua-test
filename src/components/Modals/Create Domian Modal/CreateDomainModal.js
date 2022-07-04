import React, { useState } from 'react'
import { toast } from 'react-toastify'
import CommonModal from '../CommonModal/CommonModal'

const CreateNewDomain = ({ saveAndExit, addDomain, show }) => {
  const [domain, setDomain] = useState('')
  const handleSave = () => {
    if (domain) {
      if (domain.includes('.')) {
        addDomain(domain)
        saveAndExit()
      } else {
        toast.error('Please enter a valid domain, e.g. yourdomain.xyz')
      }
    } else {
      toast.error('Field cannot be empty')
    }
  }

  return (
    <CommonModal
      show={show}
      handleClose={null}
      modalTitle={'Add new whitelist domain'}
      data={domain}
      handleDataChange={setDomain}
      cancelAction={saveAndExit}
      saveAction={handleSave}
      placeholder={'Enter domain'}
      ariaLabel={'Enter domain'}
    />
  )
}

export default CreateNewDomain
