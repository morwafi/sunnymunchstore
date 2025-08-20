import {FacebookTag, Twitter, Instagram, Linkedin, X} from 'iconoir-react'
import { Facebook } from 'iconoir-react/regular'

const SocialIcons = () => {
return(
    <div className="gap-[10px] top-px p-[2rem] right-px w-2/5 h-[100px] flex absolute items-start justify-end">
        <div className="icons">
            <Facebook width={16} height={16} />
        </div>
        <div className="icons">
            <Twitter width={16} height={16} />
        </div>
        <div className="icons">
            <Instagram width={16} height={16} />
        </div>
    </div>
)
}
export default SocialIcons