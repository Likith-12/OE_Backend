import React from 'react'
import {
    Box,
    Button,
    Grid,
    Heading,
    VStack,
    Container,
    Center,
    Icon,
    
} from '@chakra-ui/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { BiError  } from 'react-icons/bi'

import { useRouter } from 'next/router'
import { handleSignin } from '../../lib/auth'

const error = () => {
    const router=useRouter()
    const message=router.query.error==='AccessDenied'?'Please Sign in with a valid NITC E-Mail ':'An error occured'

  return (
    <Container
    maxW={'container.xl'}
    >
        <Center
        h={'100vh'}
        >
            <Box
            p={8}
            maxW={'lg'}
            borderWidth={1}
            borderRadius={8}
            boxShadow={'lg'}

            >
                <VStack
                spacing={4}
                textAlign={'center'}
                >
                    <Icon
                    as={BiError}
                    w={12}
                    h={12}
                    color={'red.500'}
                    />
                    <Heading
                    as={'h1'}
                    size={'md'}
                    >
                        {message}
                    </Heading>
                    <Button
                    
                    onClick={(e) => {
                        signIn()
                    }}
                    >
                        Retry
                    </Button>
                </VStack>
            </Box>
        </Center>
    </Container>
                    
  )
}

export default error