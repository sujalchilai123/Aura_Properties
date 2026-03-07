import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router';



export default function OAuth() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const auth = getAuth(app)

      const result = await signInWithPopup(auth, provider)

      const res = await fetch('/api/auth/google', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL
        })
      })

      const data = await res.json();
      dispatch(signInSuccess(data))
      navigate('/')

    } catch (error) {
      console.log('could not sign in with google', error);
    }
  }

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="
        flex items-center justify-center gap-3
        bg-white
        border border-slate-200
        text-slate-700 
        font-semibold
        p-3.5 
        rounded-xl 
        shadow-sm hover:shadow-md
        transition-all duration-300
        hover:bg-slate-50
        active:scale-95"
    >
      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  )
}
