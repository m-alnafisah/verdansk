def generate_codes(input_code):
    input_code = input_code.strip()
    if len(input_code) != 6:
        print("Code must be exactly 6 characters long.")
        return

    used_digits = set()
    missing_indices = []

    # Step 1: Identify used digits and positions of missing ones
    for i, char in enumerate(input_code):
        if char == '-':
            missing_indices.append(i)
        elif char in '123456789':
            if char in used_digits:
                print(f"Duplicate digit found: {char}")
                return
            used_digits.add(char)
        else:
            print(f"Invalid character: {char}")
            return

    remaining_digits = [d for d in '123456789' if d not in used_digits]

    # Helper: Generate all permutations manually (no itertools)
    def generate_permutations(array, path, results):
        if len(path) == len(missing_indices):
            results.append(path[:])
            return
        for i in range(len(array)):
            generate_permutations(array[:i] + array[i+1:], path + [array[i]], results)

    permutations = []
    generate_permutations(remaining_digits, [], permutations)

    # Fill in the blanks and print all combinations
    results = []
    for perm in permutations:
        code_chars = list(input_code)
        for idx, digit in zip(missing_indices, perm):
            code_chars[idx] = digit
        results.append(''.join(code_chars))

    print(f"\nTotal combinations: {len(results)}\n")
    for i, code in enumerate(results, start=1):
        print(f"{i}- {code}")


# Main execution
if __name__ == "__main__":
    user_input = input("Enter 6-digit code using digits 1-9 and dashes (-) for missing digits (e.g. 1-9-38-): ")
    generate_codes(user_input)