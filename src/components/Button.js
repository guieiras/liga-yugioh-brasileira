import NextLink from 'next/link'
import MuiButton from '@mui/material/Button'

export default function Button ({ href, ...props }) {
  return <NextLink passHref href={href}>
    <MuiButton component='a' {...props} />
  </NextLink>
}
