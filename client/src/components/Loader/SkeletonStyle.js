import ContentLoader from 'react-content-loader'

export const SkeletonStyle = props => (
  <ContentLoader
  gradientRatio={4}
  backgroundColor={'#333'}
  foregroundColor={'#999'}
  viewBox='0 0 400 120'
  {...props}
/>
  )