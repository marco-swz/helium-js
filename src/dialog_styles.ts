import { css } from 'lit-element';

export const styles = css`
#he-diag-outer {
    outline: none;
    padding: 0;
    border-radius: 4px;
    border: 0;
    box-shadow:0 5px 10px 0 #80808054;
    animation: fadeout 0.1s ease-in forwards;
}

#he-diag-outer[open] {
  animation: fadein 0.1s ease-in forwards;
}

#he-diag-outer[open]::backdrop {
    transition: opacity 0.2s;
    background-color: black;
    opacity: 0.2;
}

#he-icon-close {
    font-weight: 900;
    width: 35px;
    aspect-ratio: 1;
    height: fit-content;
    text-align: center;
    cursor: pointer;
    border-radius: 50%;
    font-family: cursive;
    display: flex;
    justify-content: center;
    align-items: center;
}

#he-icon-close:hover {
    transition:
        background-color 0.2s;
    background-color: whitesmoke;
}

#he-diag-inner {
    min-height: 100px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#he-diag-body {
    padding: 10px 15px;
}

#he-diag-header {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 15px;
}

#he-diag-footer {
    display: flex;
    justify-content: flex-end;
    padding: 15px;
    gap: 5px;
}

#he-title {
    display: flex;
    font-weight: 500;
    font-size: 1.5rem;
    align-items: center;
    color: var(--he-dialog-title-color);
}

#he-diag-footer input[type=button] {
    border-radius: 3px;
    color: black;
    height: 35px;
    padding: 0px 10px;
    vertical-align: middle;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.2235294118);
    font-size: 14px;
    background-color: white;
    outline-style: none;
    box-shadow: none !important;
    width: auto;
    visibility: collapse;

    &[disabled] {
        background-color: #d9d9d9;
        color: #666666;
        cursor: no-drop;
        text-shadow: none;
    }

    &:hover:enabled, &:active:enabled, &:focus:enabled {
        cursor: pointer;
        text-shadow: 0px 0px 0.3px #0082b4;
        border-color: #0082b4;
        color: #0082b4;
    }

    &:hover:enabled{
        background-color: #0082b40d;
    }
}

@keyframes fadein{
    0%{
        opacity:0;
    }
    100%{
        opacity:1;
    }
}

@keyframes fadeout{
    0%{
        opacity:1;
    }
    100%{
        opacity:0;
    }
}
`;
