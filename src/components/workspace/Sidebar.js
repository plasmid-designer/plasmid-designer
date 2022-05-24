import styled from 'styled-components'
import Toolbar from './Toolbar'
// import { useRecoilState, useRecoilValue } from 'recoil'

const Sidebar = ({ className }) => {
    return (
        <div className={className}>
            <Toolbar>
            </Toolbar>
        </div>
    )
}

export default styled(Sidebar)`
    display: flex;
    flex-flow: column;
    width: 100%;

    & .header {
        display: flex;
        height: 2.5rem;
        align-items: center;
        background: hsl(0,0%,98%);
        border-bottom: 1px solid hsl(0,0%,50%);
        font-size: 10pt;
    }
`