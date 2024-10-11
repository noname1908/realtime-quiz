import { TransmitConfig } from '@ioc:Adonis/Addons/Transmit'

const transmitConfig: TransmitConfig = {
  transport: {
    driver: 'redis',
  },
}

export default transmitConfig
