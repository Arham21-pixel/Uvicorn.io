import { redirect } from "next/navigation"

export default function LoginRedirect() {
  return redirect("/welcome?slide=signin")
}
