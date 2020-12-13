
import React from 'react'

class HomeChildren extends React.Component {
    render() {

        const { text } = this.props
        return (
            <span>{text}</span>
        )
    }
}
HomeChildren.defaultProps = {
    text:'children'
}
export default HomeChildren