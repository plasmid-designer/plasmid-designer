import styled from 'styled-components'

import logo from "./logo_header_dark.png"

const Header = ({ className }) => {
    return (
        <header className={className}>
            <div>
                <img alt="Plasmid Logo" src={logo} />
            </div>
        </header>
    )
}

export default styled(Header)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1rem 2rem;
    background: hsl(0,0%,10%);
    user-select: none;

    & img {
        object-fit: scale-down;
    }

    & .right {
        margin-left: auto;
    }
`
