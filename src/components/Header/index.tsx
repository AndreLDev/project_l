import styles from './styles.module.scss'
import Image from 'next/image';
import logo from '../../../public/images/Aquila_Capital_Logo.svg';
import { ActiveLink } from '../ActiveLink';

export function Header() {
    return (
        <header className={styles.headerContainer}> 
            <div className={styles.headerContent}>
                <a>
                    <Image src={logo} alt='Logo' />
                </a>

                <nav>
                    <ActiveLink href='/' activeClassName={styles.active}>
                        <span>HOME</span>
                    </ActiveLink>

                    <ActiveLink href='/posts' activeClassName={styles.active}>
                        <span>CONTENTS</span>
                    </ActiveLink>

                    <ActiveLink href='/about' activeClassName={styles.active}>
                        <span>ABOUT US</span>
                    </ActiveLink>
                </nav>
            </div>
        </header>
    )
}
