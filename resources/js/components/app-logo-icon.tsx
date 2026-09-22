import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 42" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20 5 L1 21 H8 V40 H32 V21 H39 Z M17 30 H23 V40 H17 Z M10 24 H15 V29 H10 Z M25 24 H30 V29 H25 Z"
            />
        </svg>
    );
}