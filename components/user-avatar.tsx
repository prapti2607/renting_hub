import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/types"

interface UserAvatarProps {
  user: User
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  // Get initials from first and last name
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

