import replacePlaceholders from './replace-placeholders';
import { describe, test, expect } from 'vitest';
describe('replacePlaceholders', () => {
  test('should handle no placeholders', () => {
    const renderParam = () => {
      throw new Error('Should not be called');
    };

    const result = replacePlaceholders('Example behaviour', [], renderParam);

    expect(result).toEqual(['Example behaviour']);
  });

  test('should handle single placeholder', () => {
    const renderParam = (param: { type: string; name?: string }, index: number) => {
      expect(param.type).toBe('user');
      expect(param.name).toBe('Alice');
      expect(index).toBe(0);
      return param.name;
    };

    const result = replacePlaceholders(
      'I am logged in as <user>',
      [
        {
          type: 'user',
          name: 'Alice',
          value: 'asd',
        },
      ],
      renderParam,
    );
    expect(result.join('')).toBe('I am logged in as Alice');
  });

  test('should handle multiple placeholders', () => {
    const behaviour = 'I fill the <selector> with <text>';
    const expected = 'I fill the login field with my username';
    const params = [
      {
        type: 'selector',
        name: 'login field',
        value: '#login-field',
      },
      {
        type: 'text',
        name: 'my username',
        value: 'alicegg',
      },
    ];

    const renderParam = (param: { type: string; name?: string }, index: number) => {
      expect(['selector', 'text']).toContain(param.type);
      expect(['login field', 'my username']).toContain(param.name);

      if (param.type === 'selector') {
        expect(index).toBe(0);
      } else if (param.type === 'text') {
        expect(index).toBe(0);
      }

      return param.name;
    };

    const result = replacePlaceholders(behaviour, params, renderParam).join('');

    expect(result).toBe(expected);
  });
});

test('should handle multiple selectors of the same type and one selector of different type', () => {
  const behaviour = 'I click the <selector> and then fill the <selector> with <text>';
  const expected = 'I click the login button and then fill the email input with my email';
  const params = [
    {
      type: 'selector',
      name: 'login button',
      value: '#login-button',
    },
    {
      type: 'selector',
      name: 'email input',
      value: '#email-input',
    },
    {
      type: 'text',
      name: 'my email',
      value: 'alice@example.com',
    },
  ];

  const renderParam = (param: { type: string; name?: string }, index: number) => {
    expect(['selector', 'text']).toContain(param.type);
    expect(['login button', 'email input', 'my email']).toContain(param.name);

    if (param.type === 'selector') {
      expect([0, 1]).toContain(index);
    } else if (param.type === 'text') {
      expect(index).toBe(0);
    }

    return param.name;
  };

  const result = replacePlaceholders(behaviour, params, renderParam).join('');

  expect(result).toBe(expected);
});
