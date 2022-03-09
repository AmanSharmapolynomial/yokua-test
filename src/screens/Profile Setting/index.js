import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import PrimaryHeading from '../../components/Primary Headings/index'
import API from '../../utils/api'
import { getToken, getUserRoles, removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import DeleteModal from '../../components/Modals/Delete Modal/DeleteModal'
import validator from 'validator'
import CustomCheckbox from '../../components/Profile/CustomCheckbox'
import Header from '../../components/Header'

const ProfileSettingScreen = () => {
  const [profileData, setProfileData] = useState({})
  const [name, setName] = useState()
  const nameRef = useRef()
  const [email, setEmail] = useState()
  const emailRef = useRef()
  const [address, setAddress] = useState()
  const [password, setPassword] = useState()
  const [passwordRetype, setPasswordRetype] = useState()
  const [disabledInputName, setDisabledInputName] = useState(true)
  const [disabledInputEmail, setDisabledInputEmail] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [disabledInputAddress, setDisabledInputAddress] = useState(true)
  const [disabledInputPassword, setDisabledInputPassword] = useState(true)
  const [disabledInputPasswordRetype, setDisabledInputPasswordRetype] = useState(true)

  const [editMode1, setEditMode1] = useState(false)
  const [editMode2, setEditMode2] = useState(false)

  const [openSimpleDeleteModal, setOpenSimpleDeleteModal] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordVisible2, setPasswordVisible2] = useState(false)

  const addressRef = useRef()

  const [checkedIds, setCheckedIds] = useState([])

  useEffect(async () => {
    // call profile data
    setIsLoading(true)
    const backendData = await API.get('/auth/profile_settings/')
    console.log(backendData)
    setProfileData(backendData.data)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    nameRef.current.value = profileData.basic_profile?.full_name || 'chael'
    emailRef.current.value = profileData.basic_profile?.email || 'tech@yokogawa.com'
    addressRef.current.value = profileData.basic_profile?.email || 'tech@yokogawa.com'
    const tempCheckedArr = []
    profileData.news_letter?.map((nl, index) => {
      if (nl.subscribed) {
        const checkedPayload = {
          id: nl.id,
          news_letter_title: nl.news_letter_title,
          subscribed: true,
        }
        tempCheckedArr.push(checkedPayload)
      }
    })
    setCheckedIds(tempCheckedArr)
  }, [profileData])

  const saveAndExit = () => {
    setOpenSimpleDeleteModal(false)
    document.body.style.overflow = 'scroll'
  }

  const runDeleteAccount = async email => {
    const payloadDeleteAccount = {
      email: email,
    }
    // /admin/delete_user
    const afterDeleteMsg = await API.post('/admin/delete_user', payloadDeleteAccount)
    console.log(afterDeleteMsg)
    removeToken()
    removeUserRole()
    window.location.reload()
  }

  return (
    <>
      <Header isLogedIn={getToken()} />
      {openSimpleDeleteModal && (
        <DeleteModal
          req={'Account'}
          saveAndExit={saveAndExit}
          title={'Are you sure want to delete this Account?'}
          runDelete={runDeleteAccount}
          data={profileData.basic_profile?.email}
        />
      )}
      <div className="profile-setting-container">
        <PrimaryHeading title={'Profile settings'} />
        <div className="profile-setting">
          <div className="profile-setting__info">
            <div>
              <img
                className="profile-setting__info_img"
                src={
                  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBIVFRgVFRUYGBgYGBgYGBgYGRgYGBIYGBgZGRgYGBgcIS4lHB4rIRgYJjgmKy8xNjU1GiQ7QDszQC40NTEBDAwMEA8QGhISHjQkISE0NDQ0NDQ0NDQ0NDQ0NDQxNDQ0NDQ0NDQ0NDQ0NDQ0MTQxNDQ0NDQ0NDQ0NDQ0NDQ0P//AABEIAJ8BPgMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwEEBQYAB//EADkQAAIBAgQEBAQFAwQCAwAAAAECAAMRBBIhMQVBUWETInGBBjKRoRRCUrHRYsHhcpLw8WOyFSMz/8QAGQEBAQEBAQEAAAAAAAAAAAAAAQACAwUE/8QAIxEBAQACAgMBAAIDAQAAAAAAAAECERIhAxMxQVFhcaHwIv/aAAwDAQACEQMRAD8A6n8UJIxUzM0kOZy4Q860xiIYrTMDxqvDhGubRWvGJWmarxqvMXAzNrJXjlr95jrUjBWmL4m5m1lrwvxMyBVhCrM+pc2t48Ja8yRVhivD1Hm2VrRn4oCYf4kwDiO8phlBcsa3TjhK9XGzHbEd4p681wyv2qZYxqvjZVqYrvM9qkU7ynhXsXWrwDVEol4OYx9Y5rjMIBVZWDmGrQuOjyN8MR1OnaKRo1HhcapYtUxLCCU0eW6dScri3tcptaWEqGVEcR6us1jbBlNrOYQTUEqVaw5So9e06XzZT4xwi++IkpVB0mSa8OnXtOd8uW9tcJpsZRKOOuo8oEhcVeVq+KJ0ln5JlNaWOFxu9q341wLXinxr2teBVXpEMJiSN20HjNe8fSV3IAgUaeus3sJTS3Qyt1dRa63S6HCVG5uZZOEXmFnmcDc6SU8MjaauWP8AH+2NZf8ARxYMIQgsJUnpPkQsYqyVWGogYlVhieURirM0xCLCtGKkO0CUFhWhESLS0dvQTBqOFBZjYDcnYTl+I/FyKbUwpANiWzak7WAtp3mb01Jt1BMAtOYofGFMjzp6lDt7Hn2vN7B42nVXNTcMO247EcpTVGWNh5JgkxgE8ViyQTBaPKQCsURItHMJGWBLEMGTaRaFh2kPGo0UqxyJM3EymoZYRpXQR6zncTKso9pJryqzxRqQuJ5LbVIpnEqPUMgPM3BqZLOYSM5ic88XmbidmtUizUii89eHEyjLmSqseUhXtLNPF25CYy3Pkbx1+oTCOdhNChhnA1vEU8cO49Iz8f8A1GY7v0/4P8C+8clM8gImnir8x7y2lXuPaMk2ry044CEBPAQ1Wew8+VCrGKsJVhhJk7QiRwWeVYQENF609aSBPES0gz1pJnllpOA+M+MMHyIxsnlsNmY/MT6bTia1Uk3vcHlbQg3OvfWbPGdXdr3IZj6X116EAicxUO9j/wAv0mY6XrpcTFgaBd+fvyPKaHC+LVKL50Iva5B0D2tcMB1H3ttMelhXKZzYKSQLnzPbfKLagdfXe0s8Mw5d7HaxufXrKyGbfYeFcRp4hFdD8wBtzUnkZeKzB4PiMDgUFJ8QiM6pUKvfyZ1HPUDbb/E28PxDD1f/AMq1N+XkdWsehynQ+s1J12xfvQjBYRjLAYS0xssiARG2glZaWwTwSMCQ1SGjstVjFEIJDCzOjtKiC7zzGLMOJ28Wi3eS0C0NLaCZ6MVIapCmK+s9Yy4KMbTw15ztbkUUQxy0uxmmmFWMFETlllt1xxZgodjJXD35Gai0RLC0VExa1pkLh7coxaQ6TRekIIowtJFKkJaygcpKIBDBhpbcqFjFSMFOGEnsPP0BRDAkhIS04aTwhBYapDCGWkXaeIjhTMCsyopZzZRqSeUEQ5ABJ0A1JOgE5vinxlg6NxnLsOSC4v3Y/wBrzkviLjVWsCGqFFLaAC6gHpltf119rznqfDKC+Z3L9vkHvc3hpozG42i5Yq2TMSxDE2JP3GwHtKmHwxJuRp21HsRDanTc5aavb/xqhB9WY3PuZap4Suny3PPKcl7252OsLj103jl320MNTDoqGwCZgV6hsxFvS9/rK48OktmJylgWy/NlDAkDvlvB/GgC2mbsQR7GXvh7BUK71KmLbLhqKXYksoao5siAr5i2jnKtycu05TG7d8sseO2TiuFtkwzUVfPX8Q3DG7m6lWOpsbFr8v3nV4HDvSFNEqElGDPUJuxYG9xmvcX0AIsBvzvc4TVzUFVVZFCgKjghkTdRrqfLY353BlPFvkJPTb1v/iGWVvRxxn1lcY+MMZSrkB28oXKGVQtRT5lZlUAahstxbRRsZ9Pw9UOiONA6K4HQMoa33ny/HfBONxFRawKFa1nLM1vCUgABl3OmoCg6Aaz6jQohERBsiqg9FAA/ad58fLl9etJVYUkSrCQJM8JMK0kTxngZ4mGkUwgERrCAVlpbKIkhYYSEFhohURqyAsm0zxMpitGq8QJIMzcWpksrUhrUlUGSDMXCNc14VBPeNKVzPXMPXDzXlrieasJR1gm8PVFzq6a08K8o6z2svXBzrwEm0K09afe+dIEICQBCWSGixyrAQRqrJJCTifivHo7Gm5sitYAE+Zl3Y++g9Os7xUnzL47wNR6xWiwVbkuSAfM3zZbcvXneFMcdjuI2fw6CljtdtberNqf7bQ04MW81Zsx6bKPbnNfhfAlpf1MfmZt/8DtPcSxCrcA/3F/9MjWebJ5QALdDcW62ttKeIxaXs1POOR/N6ggfzEV8Wb6iwJFj097m45T2GqjOxO4Gh6eg7SRufDuN2U9Cpz3/ANZIvO34FwOhSwj4jMKjmlVdH8wFEmkQcqXIDi2rEX5aDfjBTw+5c5t9NGPa2s8eMOUqUKbOiMjq+ZSc/lJCnKLAsQFubWzb2hYZfx13C3xFVFxOIsprMxpoAFCUVC+GugF7gtYnUgAxtLhi1qyIxst2LD9YGpUdLgW9zN3G4a+CQ86aU3BH9CANbtlzTN4dW86P0OvodD9iZwymstu+FtxrpmEEw2gGdnANp60mSBDaeAk2khZQr8SAuFW/K95atFFiscqXG7dJSHGG2yC/rKVcMxJJ31MRlItc3A5bfedZjGLlWkONG9mS3vL2Hx9N+dvX+ZhjCqTfMLdGJv8AWAr5L7+xuPcGFxn4plf11YWTac1Tx1RLFbi/IjQ+ktDjVT9A9Zm41rlG4FkhJzzcSqMfMxQf0i8UvEainQk+uhMOFXKOkYAbm0rvj6S6Fx+85qq7uSST9YrKZqeOfouTqk4jRP5xLKVUOzD6zjijWvyhU8U66Kxt9RK+NTJ17VUG7L9ZC4mn+tfqJx9idTFt6Q9Z5u1/EJ+pfqJIdTsw+s4kaQWe21/2tL1T+Vzd3aetOOoVW1HjZCDpqSCOt5XOLcE2dj3udYen+17NOmwPHab3zKUtzJVgfpr9ppYfEU3vkYNbe249pyeLwdRrsmUHYlSA6Dc5gAc50tt6bSt+Iyoc4rDMQQcy5165VsSE07d7bzjPNZ9db45+O7Cw1Wczwb4jp6I7swsLMU1W2nnIPPT37EW6Ph+Lp10z02DKTa45Ebg257TrjnMnO42LCLLCLIRI5EmtjROOxIpU2c7gWHdjt/PtOBx1YkbsDcknTUzpPi7EkZKd+WY+5sB9j9ZxNeo4Ou3KJkKqVtwzKTY/lAN/Wc1iquuvPkTb6MbD7zYxdYMu3m9v+5mYizg6C43/AJENpi4rD6EhXHfLe/umn1icLiAAw/Nzj3wpPUAdgLe95lV1YHMDfv1/mRaw4cGGZWuxubX1lnCmuvmd3RRtmIA07tpMdMayi66HbveWKDG/iVB4h2UMSczdFA5bX/zJO/4V8QeFSanVdXSojkBXW9MZTmKn82n5eZ272eFnMgN79xOKwFMvmdmGbbQXFgL5E1sAAPtN7h+KaiyqWDK5ylRtTNhax/NroT+2055zfx08eXG6v6+jYSpnRW52sfUaH9owiZvw/VzKy9CCPfQ/sPrNkUTHG7gymrVcCNSmZD1KaaFrkchqYmpiXYeUZR94yMUzFVVVSL+YjQTDZAO5lqoOpiGBOg/adJixclZlvEIpa91taXRSA3N/2iHcdbTcjNVngW6wMQ4J0/7ghXJuFM1pnZtzfc/xJ8Tt0GnOAniE2t/AlpaFvmhejAN0GsCwli+mlh3ldgo2MCnW21hAdCew+kI1G9Ipj1MhseUbAxY7QHcLpBNcdI6GzAvUwHIESa5gOSZqYjkca46xfjjnFZZ4LLjFuj8btDWsDuIq0kJHjBt0C1kCApcZtQGFttCpzEHptyOxMl3Qg3qBiQPlzg6aELkYDmJh1cclZLOxVlsTUDA2YEXUX0UH156czMx+NVFYqrXzWIt589gBe5Gp/ptcXnlSbejbG8/DqZzutNnZvmyOVcm2txcrffXqdOsDh1U0muj1qRObOGD5XuQFzEGynobHntecmnxPWSpmTkLagg20+bKAdP7ToOGfEdZl8zBlYebykhNNmBNm33P6Y2ZYzY3K+oYHjFNrK5CMdASQFfWwIN7a9Jr513uNN9dp8fbilF8hawDAIUIyIGOtwyElWvc/xNM1VzN4LvnemVbM2ZHWwR1V73B3te507x9mvo4o45i/xDmqCwDHyakXRdFPe4sfeYtWqCcj6dzsZcqOSFOtiAVzKV8vLQ+w9pkYl2LG4JHPmLd+k+mVxpOKV9rBrcmsdOoJmXiUYG4ZQRtlO0fWbNo1ynYnynqCNPYz3/xr6ZQHXkbG49ZVKNeq7DznY8trDfSUsXQBJs199xY6G2ljtpNjE4POCiixHlsJSqYbIVIQ6AKc2puOel7j76yTCqpY5exP2myuGVlLhahVV8z5Gyqttg9rLe+pP95Txqeba2n+NvefQvgIsaTrc5SEBG4b5wQRz0tKS3qK3X1xmFrhAAvlLLe+wUE2tmvvYC57y7QfM1JBr509rMCZqfE3wt4YNWgDkGrJuaY5kdU+47i9s/4fpMKviMMoQGwOoJItpyIGuohlLjOzj3Y+i/DzFC5ABuLC/LUGbD1HbdvYaCY3w5imdm/SANeV/wDl50DgdI+LHo+a9qPhAdIFSsdh9ZYqDtK9RRznbThtSdCdbiV3LciZbcqJVq1JoWE1GJ0JgJSUnX7mQ9QxbMZDR7imh01PXe0W+IPKVzeLJjpHmu3LSKat119TBtJKHpLUT3jH1g+K3STlky0thZyYvXrGET2S8ehstjeRlj/DkBJLROWeCRrKJIEtgvw5PhxuWeyDvLZ0AJIKGNy94QSS0bT4WbL4dREut3TIHUG2uVrnn1JvrrMziXA2V1dMmaxOUIQDoMwKZbAmxOmsoY7H1QfEBqKmaxzEgK1zYrzC6Ab201O0fV+IWtayOdDYDNrcchfKRYHTXQanUTyt2fHodfrUrcNAQsUZBkJGi5i2ViQrAg2AG23acPisJlvkz2sSAxBCgkBSCLdbWN9jvN/F8ZqNTyi/zC62NguuuU8gRsdbgiVPxNNiHyO1yQwJuQdBdjoAel+2mly47/YMpGTSw7HW+gALWIudbbc/8Te4XXqoMlubAAhQAwGg9SbDlufeslbDs4VqZAFwUDGwAO5JsG39rd51uD4NhQmdXZMvnDMxKqV5lW05WmsrP2Myd9M/iXEKhRS6BHUANYMD5r6kfmvob25+swnqs5/+uozHmls/1Ciw/eaHxNi89Rza5bLe6WBsqjym/PKDblqJmYenVG68tMh86A9VGhHtOvj6xYy+qwqqSbnI3+5G/vNPCUmC53cAflCMbue2klKdNNarK78ktovrEYuu987Dyja1tB/SvKbZXcThLWZLhiLm+l+0o1tBfUW3B5GXOHYlqiFGbXdWO4PImV61dlYq9Ni4uCBa1ReovY39LyTnseLm/Uf3H8z6h8DUV/CoQNSz5j1Iaw+2WfO8c6OAArKwOxHK99/badz8AVLo6HlZvubn7gH0E1jdVnKdOtKqN4unRpAWCJa97BVAudza28aaQMJaQAnXUrHcFTsosqgDoNBPO5MjXnBqWGrMF9SB+8Ph+luplWpTMtNTBFwfcG8SUI5xCo9MyvUQ9JecxDv3klFqXaAMOZcaqItqse1qK5oNBNEc44tBIJ/6l2NFFByglR1jGRoJomS0VkHWGAsIUmnvBMloOW894Z6w/AM9kI5x2gMnaQRaM8Q9Lz2YcxAEi3SSB2jwOkjKY7WiSkgpGEGDkMVQhZIt3hZTICyTFGHBpkvUNNblUDBSpLXJDOD15i3OVsfwimjoUqa/mtfIcqjRW9CDv1Gk2anG6dej4dJRYEBgxtcscvW97EnXp1mfivhoEqEdkOZVsxJCZQFDG40BAvfXfXnbzJNf0+20NTDEEggZWUEFQBkKixGVbaHzHrqOkrcPc1Q6+UjUlSGViN0CuD1Gm9ria1Ph1RACFcuXCefyKA35gADceX/M0aHA8jhzTJpEhmZFC2vcllFzpY/l1IFrayTJf4ZV1DgnPYkhEuQQNdSRfQXAOv7xvD+E5XCtUZzYFVdbKdbHKFJFx6HrpNjjXEkwxWmHerYG36qZAFkNtcu24/LKnCsbnPlZkdbh0cWTNfNYqw8t8zX9F6y/9VdLR4aKjDxlPluFN1XLbR7Ej5bjc6C05PimFqU2IUMLnyuedwPLcaXt/M263E6qA+UhGzhGzi91Y7BVzZTrvv8AvcxHEQcMaZXNlVmBZWAsAcoQbgggb8jz2msbcaLJY49OHZRmc6bk31icTXVkyqSQDl62B11MCqKjnW4X9P8AiNxNMBAApUX1vv2ndyFg6pGWwOnMW+86ilh6eISx+ZfZhbY/5nL4Kibi72v+Uf3nSYCqyEXym3NR8479DJKmP4cAmY2Lg2Dc2HQ9ZufAdAEVDaxsv2JuP2h4mmtRfLsTf1vOc4tjGwyKiu6Mzm5RipCgcypvY32/iSfSKrKguzBR1JAH1MycZ8QYamLl83p5R/uaw+k+cYjFu5ILs5I8pv5iLXyE/rHX8wIMppUY3U3zW0G2deTId9uV7jlN8qzp29bj71fkNQA7BBkXXo9wx9j7TC4li2U+bfqwzN7MwufWc3Q+b2vuTv6yxjcQ+SzXNjYE9wdAfaYt21poLxeolirkG4tY6kzuuBcV/EUQ5+YEq1uosb9rggz5FTr+YXPP7zvfgYHwqjbA1mA9FRBNYfWcvjrHHrEtTB6yM4G5+kE1exnZhJpDoZORRuPrB8Zuhi2rH9N4drozMnK08T0ldqx/RBOJb9MdLcWQ56QGaIOJP6ZAxH9MNLcOkXHWCK69D9JPjr6e0VsZEjL2ng/oY1WHO0EVlHSeyA8jGsR0geL7S2geFbW88q+sYSDBKntFPe0E26GGBJFpIFlkGn/wRmQdZOUjYy2tOJ4FgGplXqPZc2WyAXJOou7aW6Ec7mdu2IphFY0kqPnUboxcEfMSR5WFzoNDc+s5w4dQBkoo92BU6FSdrlHt9NtNhN2l8KYiopu9Ck9jYJTv5Sb2zLl1GW22208+3d2+qRfXidEsq00vqGcO5tTtqQMpOtwPoRtE1cbiapcI+VWKhVKZlyZrF8ykBhZxfYjKLjWJw3w7iKBUl6dg24Ba4uNwRpc8gPfmOpq8NucxRTlzDLe6tmH9W3LlCEnAYXOlnCsy+W4OVj3Rhpvt3trpMuvg6iqjqQpDE1WbU2VtCy5twLa76acp1KU6qJm8pAAIDXuBawBIvfmb/aYuK4M+I1qVgL5TZUYgWAvbM3ryE0FdOG4OqQ5ZWLg58pYkab5Ddh7WH92ngtArd3d2JyjPZS2lvLm1Pyk8/SXk+HSq5ErMEvoAMpW+5zDUn+JaFCsuq1A65QMrizG1rEvYm97/AFhU5biXwWigFCyjnfK+17Muot76azH4r8JVEQlXWoLdTnI38vI+gJ9J9CXDMbNUupA0DWa3T5Sbi/KY3GOE1Kty1ZqKlTdV8xJ13Ya2tyud48shqPj1HDsrkDUDXmbe42950+GYEddN+f0lni3wxUqt4tHEguAqlXQqrZb3LMt7t3y8pjY9cRhcv4imoViQlSkwIJH9LWblzttOuOUy+M2WNmlxIqRTWzBr2PJee/Scx8Qm9RxcmwT2b5j+9vpLmHLu2elldbAkNddDdfLfb5jMjjbMHcn5mCfUoommSqFYAI2v6WH+n5CO41HpAr4o3XqG352uRK1fRiv6VUD1Gh/9jD4bgqmIcrTAJF2Yk2VBrdjzPsCZIh6zZiVJGvK0Ti8VmI6jc9TCxK2Zhe9mK3ta9j05bSoFkjKd+W/XpPqXwSgXDdbu2/PRQfvefOMJSsLnfkOnIn+0+w/D/CylGnT0BCAn/U3mbbuTHHKS7ou/kNBXewkFzyAgVqlFAWLNYGxOW4Ft9L3MM1aGUtnawGY+W2nK2/b6xvmw/kevL+AhjIKiVxxTDsDlBuATre5UX1HK9+tto2iQyq42YAg9iL7Rx8mOXwZY3H6i3QGQCb2tGG45yASeZnRl5j2g5O08dIObvJPBBbX9oLBekNxF5O8kjxE/SJBqJPFVB11gm3SI2JKsk1T0i7wWqEcpaWzs7c9ISN/VKv4vtGpUUjaSliyA3VTJYN0BlUa7XEcjsNzeCEHtuv2hh1krWvyhG3SRf//Z'
                }
              />
            </div>

            <div className="profile-setting__info_name">
              <h4 className="name">{profileData.basic_profile?.full_name || 'Michael Jordan'}</h4>
              <p className="details">FCP user since April 2017</p>
            </div>
          </div>

          <div className="profile-setting__basic-profile profile-setting__box">
            <h1 className="profile-setting__heading">BASIC PROFILE</h1>
            <div className="profile-setting__basic-profile-edit">
              <div className="edit_input">
                <i className="fa-solid fa-user" />
                <input
                  type="text"
                  disabled={disabledInputName}
                  ref={nameRef}
                  onChange={e => {
                    setEditMode1(true)
                    setName(e.target.value)
                  }}
                />
                {getUserRoles() == 'Technical Administrator' ? (
                  <></>
                ) : (
                  <i
                    className="fa-solid fa-pen-to-square edit"
                    style={{
                      color: disabledInputName ? 'var(--bgColor2)' : 'grey',
                    }}
                    onClick={() => {
                      setDisabledInputName(!disabledInputName)
                    }}
                  ></i>
                )}
              </div>
              <div className="edit_input">
                <i className="fa-solid fa-envelope" />
                <input
                  type="email"
                  disabled={disabledInputEmail}
                  ref={emailRef}
                  onChange={e => {
                    setEditMode2(true)
                    setEmail(e.target.value)
                  }}
                />
                {getUserRoles() == 'Technical Administrator' ? (
                  <></>
                ) : (
                  <i
                    className="fa-solid fa-pen-to-square edit"
                    style={{
                      color: disabledInputEmail ? 'var(--bgColor2)' : 'grey',
                    }}
                    onClick={() => {
                      setDisabledInputEmail(!disabledInputEmail)
                    }}
                  ></i>
                )}
              </div>
              <div className="edit_input">
                <i className="fa-solid fa-house-chimney" />
                <input
                  type="text"
                  disabled={disabledInputAddress}
                  ref={addressRef}
                  onChange={e => {
                    setAddress(e.target.value)
                  }}
                />
                {getUserRoles() == 'Technical Administrator' ? (
                  <></>
                ) : (
                  <i
                    className="fa-solid fa-pen-to-square edit"
                    style={{
                      color: disabledInputAddress ? 'var(--bgColor2)' : 'grey',
                    }}
                    onClick={() => {
                      setDisabledInputAddress(!disabledInputAddress)
                    }}
                  ></i>
                )}
              </div>
            </div>
          </div>

          <div className="profile-setting__basic-profile profile-setting__box">
            <h1 className="profile-setting__heading">CHANGE PASSWORD</h1>
            <div className="profile-setting__basic-profile-edit">
              <div className="edit_input">
                <i className="fa-solid fa-unlock" />
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  disabled={disabledInputPassword}
                  onChange={e => {
                    setPassword(e.target.value)
                  }}
                  placeholder="Enter New Password"
                />
                {passwordVisible ? (
                  <i
                    className="fa-regular fa-eye"
                    onClick={() => {
                      setPasswordVisible(false)
                    }}
                  />
                ) : (
                  <i
                    className="fa-regular fa-eye-slash"
                    onClick={() => {
                      setPasswordVisible(true)
                    }}
                  />
                )}

                <i
                  className="fa-solid fa-pen-to-square edit"
                  style={{
                    color: disabledInputPassword ? 'var(--bgColor2)' : 'grey',
                  }}
                  onClick={() => {
                    setDisabledInputPassword(!disabledInputPassword)
                  }}
                />
              </div>
              <div className="edit_input">
                <i className="fa-solid fa-unlock" />
                <input
                  type={passwordVisible2 ? 'text' : 'password'}
                  disabled={disabledInputPasswordRetype}
                  onChange={e => {
                    setPasswordRetype(e.target.value)
                  }}
                  placeholder="Retype New Password"
                />

                {passwordVisible2 ? (
                  <i
                    className="fa-regular fa-eye"
                    onClick={() => {
                      setPasswordVisible2(false)
                    }}
                  />
                ) : (
                  <i
                    className="fa-regular fa-eye-slash"
                    onClick={() => {
                      setPasswordVisible2(true)
                    }}
                  />
                )}

                <i
                  className="fa-solid fa-pen-to-square edit"
                  style={{
                    color: disabledInputPasswordRetype ? 'var(--bgColor2)' : 'grey',
                  }}
                  onClick={() => {
                    setDisabledInputPasswordRetype(!disabledInputPasswordRetype)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="profile-setting__basic-profile profile-setting__box">
            <h1 className="profile-setting__heading">SALES NEWS BY ROTA YOKOGAWA</h1>
            <div className="sales-news_background">
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <div className="profile-setting__sales-news ">
                  {profileData.news_letter?.map((info, index) => (
                    <CustomCheckbox
                      info={info}
                      setCheckedIds={setCheckedIds}
                      index={index}
                      key={index}
                      checkedIds={checkedIds}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="save-btns">
            {getUserRoles() == 'Technical Administrator' ? (
              <></>
            ) : (
              <button
                className="delete-btn"
                style={{
                  cursor: 'pointer',
                }}
                onClick={async () => {
                  // delete user APi Call and the logout
                  document.body.scrollTop = 0
                  document.documentElement.scrollTop = 0
                  document.body.style.overflow = 'hidden'
                  setOpenSimpleDeleteModal(true)
                }}
              >
                Delete Account
              </button>
            )}

            <button
              className="btn"
              style={{ color: 'white' }}
              onClick={async () => {
                if (
                  name &&
                  validator.isAlpha(name.split(' ')[0]) &&
                  validator.isAlpha(name.split(' ')[1]) &&
                  name.length >= 5
                ) {
                  if (name && name != '') {
                    const payloadName = {
                      full_name: name,
                    }

                    const afterUpdateMsg = await API.post('/auth/profile_settings/', payloadName)
                    toast.success(afterUpdateMsg.data.message)
                  }
                } else {
                  if (editMode1) {
                    toast.error(
                      'Name should be atleast 5 letters and must contain only letters A-Z or a-z'
                    )
                  }
                }
                if (email && validator.isEmail(email)) {
                  if (email && email != '') {
                    const payloadEmail = {
                      email,
                    }
                    const afterUpdateMsg = await API.post('/auth/profile_settings/', payloadEmail)
                    console.log(afterUpdateMsg.data.message)
                    toast.success(afterUpdateMsg.data.message)
                  }
                } else {
                  if (editMode2) {
                    toast.error('Please enter email in proper format - abc@xyz.com')
                  }
                }
                if (address && address != '') {
                  // const payloadAddress = {
                  //   address: address,
                  // }
                  // const afterUpdateMsg = await API.post('/auth/profile_settings/', payloadAddress)
                  // toast.success(afterUpdateMsg.data.message)
                }

                if (password && passwordRetype) {
                  if (password == passwordRetype) {
                    // call for passsword change /auth/password/change/
                    const payloadPassword = {
                      new_password1: password,
                      new_password2: passwordRetype,
                    }
                    console.log(payloadPassword)
                    const afterPassChangeMsg = await API.post(
                      '/auth/password/change/',
                      payloadPassword
                    )
                    toast.success(afterPassChangeMsg.data.detail)
                  } else {
                    toast.error('Password and retype password do not match')
                  }
                }

                // call for news letter changes

                // /auth/profile_settings/
                const tempNLArray = []
                profileData.news_letter.map((nl, index) => {
                  let diff = true
                  checkedIds.map((ci, ind) => {
                    if (ci.id == nl.id) {
                      diff = false
                    }
                  })
                  if (diff) {
                    const obj = {
                      id: nl.id,
                      subscribed: false,
                    }
                    tempNLArray.push(obj)
                  } else {
                    const obj = {
                      id: nl.id,
                      subscribed: true,
                    }
                    tempNLArray.push(obj)
                  }
                })
                const payloadNews = {
                  news_letter: tempNLArray,
                }
                console.log(payloadNews)
                const afterUpdateNewsMsg = API.post('auth/profile_settings/', payloadNews)
                console.log(afterUpdateNewsMsg.data)
              }}
            >
              Save Changes
            </button>
          </div>

          <div className="events_trainings">
            <div className="profile-setting__basic-profile profile-setting__box registered_events">
              <h1 className="profile-setting__heading event_training_heading">
                You are registered for the following events & trainings
              </h1>
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <div className="profile-setting__basic-profile-edit">
                  {profileData.future_trainings?.map((training, index) => (
                    <div className="edit_training" key={index}>
                      <i className="fa-solid fa-calendar-check" />
                      <div className="training_text">
                        <span>{training.training_topic}</span>
                        <span>{training.date}</span>
                        <span>Latest cancellation date {training.cancellation_date}</span>
                        <span>{training.address}</span>
                      </div>

                      <i className="fa-solid fa-pen-to-square edit" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="profile-setting__basic-profile profile-setting__box last_events">
              <h1 className="profile-setting__heading event_training_heading">
                Last participated event
              </h1>
              {isLoading ? (
                <span>Loading...</span>
              ) : (
                <div className="profile-setting__basic-profile-edit">
                  {profileData.participated_trainings?.map((training, index) => (
                    <div className="edit_training" key={index}>
                      <i className="fa-solid fa-calendar-check" />
                      <div className="training_text">
                        <span>{training.training_name}</span>
                        <span>{training.date}</span>
                      </div>

                      <i className="fa-solid fa-pen-to-square edit" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileSettingScreen
