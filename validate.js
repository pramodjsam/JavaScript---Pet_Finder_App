export function isValidate(zip){
	return /^\d{5}(-\d{4})?$/.test(zip)
}