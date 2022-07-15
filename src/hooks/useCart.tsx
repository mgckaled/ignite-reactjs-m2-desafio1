import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '../services/api'
import { Product, Stock } from '../types'

/**
 * A React Node is one of the following types:
 * Boolean (which is ignored)
 * null or undefined (which is ignored)
 * Number
 * String
 * A React element (result of JSX)
 * An array of any of the above, possibly a nested one
 **/
interface CartProviderProps {
	children: ReactNode
}

interface UpdateProductAmount {
	productId: number
	amount: number
}

interface CartContextData {
	cart: Product[]
	addProduct: (productId: number) => Promise<void>
	removeProduct: (productId: number) => void
	updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
	const [cart, setCart] = useState<Product[]>(() => {
		const storagedCart = localStorage.getItem('@RocketShoes:cart')

		// conversão do valor registrado em 'string'
		// O array de produtos será transformado em 'string'
		if (storagedCart) {
			return JSON.parse(storagedCart)
		}

		// se o valor for 'null' retorna array vazio
		return []
	})

	const addProduct = async (productId: number) => {
		try {
			// criar um novo array com os valores de 'Cart' para garantir imutabilidade
			const updatedCart = [...cart]

			// Verificação se o produt.id iterado = ao produto.id da função
			const productExists = updatedCart.find(
				product => product.id === productId
			)

			//
			const stock = await api.get(`/stock/${productId}`)

			const stockAmount = stock.data.amount

			const currentAmount = productExists ? productExists.amount : 0

			// quantidade desejada
			const amount = currentAmount + 1

			if (amount > stockAmount) {
				toast.error('Quantidade solicitada fora de estoque')
				return
			}

			if (productExists) {
				productExists.amount = amount
			} else {
				const product = await api.get(`/products/${productId}`)

				const newProduct = {
					...product.data,
					amount: 1
				}
				updatedCart.push(newProduct)
			}

			setCart(updatedCart)
			localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart))
		} catch {
			toast.error('Erro na adição do produto')
		}
	}

	const removeProduct = (productId: number) => {
		try {
			// TODO
		} catch {
			// TODO
		}
	}

	const updateProductAmount = async ({
		productId,
		amount
	}: UpdateProductAmount) => {
		try {
			// TODO
		} catch {
			// TODO
		}
	}

	return (
		<CartContext.Provider
			value={{ cart, addProduct, removeProduct, updateProductAmount }}
		>
			{children}
		</CartContext.Provider>
	)
}

export function useCart(): CartContextData {
	const context = useContext(CartContext)

	return context
}
