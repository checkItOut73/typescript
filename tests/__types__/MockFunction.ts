export type MockFunction<Type> = Type extends (...args: any) => any
    ? Type & {
          mockReturnValue?: (returnValue: ReturnType<Type>) => void;
          mockImplementation?: (implementation: Type) => void;
          mock?: {
              calls: Array<Parameters<Type>>;
          };
      }
    : Type;
