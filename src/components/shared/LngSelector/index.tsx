//'use client';

//import { useT } from '@/locales/client';
import { getT } from '@/locales';
import { languages, fallbackLng } from '@/locales/settings';
import Box from '@mui/material/Box';
import Image from 'next/image';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
//import InputLabel from '@mui/material/InputLabel';
import Link from 'next/link';

const LngSelector = async () => {
    //const { t, i18n } = useT('client');
    const { t, i18n } = await getT('server');
    const lng = i18n.resolvedLanguage || fallbackLng;
//<InputLabel id="lng-select-label" style={{ display: 'none' }}>{t('Language')}</InputLabel>
    return (
        <Box sx={{ minWidth: 30, marginTop: 1 }}>
            <FormControl fullWidth>
                <Select value={lng} labelId="lng-select-label" name="lngSelector">
                    {languages
                        //.filter((l) => lng !== l)
                        .map((l) => (
                            <MenuItem key={l} value={l}>
                                <Link href={`/${l}`}>
                                    <Image
                                        src={`/assets/images/flags/${l}.png`}
                                        alt={t('lng')}
                                        width={38}
                                        height={20}
                                        priority={true}
                                        fetchPriority="high"
                                    />
                                </Link>
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Box>
    );
};

LngSelector.displayName = 'LngSelector';

export default LngSelector;
