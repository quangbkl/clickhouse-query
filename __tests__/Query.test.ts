import {describe, expect, it} from '@jest/globals';
import {ClickHouse} from 'clickhouse';
import winston from 'winston';
import {fx, expr} from '../src';
import {Query} from '../src/Query';

// @ts-ignore
jest.mock('winston');

// @ts-ignore
jest.mock('clickhouse');

function createLogger() {
    return winston.createLogger({
        level: 'info',
    });
}

function getQuery(): Query {
    return new Query(new ClickHouse({}), createLogger());
}

describe('Query', () => {

    it('wraps whole SQL with alias', () => {
        const query = getQuery();
        const sql = query
            .select(['id'])
            .from('users')
            .as('p')
            .generateSql();

        expect(sql).toBe('(SELECT id FROM users) AS p');
    });

    describe('Query helper functions', () => {
        it('generates anyLast(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.anyLast(expr('created_date'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT anyLast(created_date) FROM users');
        });

        it('generates anyLast(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.anyLast('created_date')]).from('users').generateSql();
            expect(sql).toEqual('SELECT anyLast(created_date) FROM users');
        });

        it('generates anyLast(X) with position as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.anyLastPos(expr('created_date'), 1)]).from('users').generateSql();
            expect(sql).toEqual('SELECT anyLast(created_date)[1] FROM users');
        });

        it('generates anyLast(X) with position expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.anyLastPos('created_date', 1)]).from('users').generateSql();
            expect(sql).toEqual('SELECT anyLast(created_date)[1] FROM users');
        });

        it('generates avg(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.avg(expr('rating'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT avg(rating) FROM users');
        });

        it('generates avg(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.avg('rating')]).from('users').generateSql();
            expect(sql).toEqual('SELECT avg(rating) FROM users');
        });

        it('generates avgIf(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.avgIf(expr('rating'), 'rating > 0')]).from('users').generateSql();
            expect(sql).toEqual('SELECT avgIf(rating, rating > 0) FROM users');
        });

        it('generates avgIf(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.avgIf('rating', 'rating > 0')]).from('users').generateSql();
            expect(sql).toEqual('SELECT avgIf(rating, rating > 0) FROM users');
        });

        it('generates min(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.min(expr('amount'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT min(amount) FROM users');
        });

        it('generates min(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.min('amount')]).from('users').generateSql();
            expect(sql).toEqual('SELECT min(amount) FROM users');
        });

        it('generates max(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.max(expr('amount'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT max(amount) FROM users');
        });

        it('generates max(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.max('amount')]).from('users').generateSql();
            expect(sql).toEqual('SELECT max(amount) FROM users');
        });

        it('generates sum(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.sum(expr('amount'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT sum(amount) FROM users');
        });

        it('generates sum(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.sum('amount')]).from('users').generateSql();
            expect(sql).toEqual('SELECT sum(amount) FROM users');
        });

        it('generates count(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.count(expr('id'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT count(id) FROM users');
        });

        it('generates count(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.count('id')]).from('users').generateSql();
            expect(sql).toEqual('SELECT count(id) FROM users');
        });

        it('generates count(DISTINCT X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.countDistinct(expr('created_date'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT count(DISTINCT created_date) FROM users');
        });

        it('generates count(DISTINCT X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.countDistinct('created_date')]).from('users').generateSql();
            expect(sql).toEqual('SELECT count(DISTINCT created_date) FROM users');
        });

        it('generates count(DISTINCT X) as array', () => {
            const q = getQuery();
            const sql = q.select([fx.countDistinct(['created_date', 'email'])]).from('users').generateSql();
            expect(sql).toEqual('SELECT count(DISTINCT created_date, email) FROM users');
        });

        it('generates countIf() as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.countIf(expr('amount_diff < 0'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT countIf(amount_diff < 0) FROM users');
        });

        it('generates countIf() expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.countIf('amount_diff < 0')]).from('users').generateSql();
            expect(sql).toEqual('SELECT countIf(amount_diff < 0) FROM users');
        });

        it('generates abs() as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.abs(expr('amount'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT abs(amount) FROM users');
        });

        it('generates abs() expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.abs('amount')]).from('users').generateSql();
            expect(sql).toEqual('SELECT abs(amount) FROM users');
        });

        it('generates if() true condition = scalar, false condition = scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.if(expr('amount > 0'), 50, 100)]).from('users').generateSql();
            expect(sql).toEqual('SELECT if(amount > 0, 50, 100) FROM users');
        });

        it('generates if() true condition = expression, false condition = scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.if(expr('amount > 0'), expr('amount'), 0)]).from('users').generateSql();
            expect(sql).toEqual('SELECT if(amount > 0, amount, 0) FROM users');
        });

        it('generates if() true condition = scalar, false condition = expression', () => {
            const q = getQuery();
            const sql = q.select([fx.if(expr('amount > 0'), 0, expr('amount'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT if(amount > 0, 0, amount) FROM users');
        });

        it('generates if() true condition = expression, false condition = expression', () => {
            const q = getQuery();
            const sql = q.select([fx.if(expr('amount > 0'), expr('price'), expr('price_discount'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT if(amount > 0, price, price_discount) FROM users');
        });

        it('generates round(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.round(expr('price'), 2)]).from('users').generateSql();
            expect(sql).toEqual('SELECT round(price, 2) FROM users');
        });

        it('generates round(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.round('price', 2)]).from('users').generateSql();
            expect(sql).toEqual('SELECT round(price, 2) FROM users');
        });

        it('generates groupArray(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.groupArray(expr('created_date'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT groupArray(created_date) FROM users');
        });

        it('generates groupArray(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.groupArray('created_date')]).from('users').generateSql();
            expect(sql).toEqual('SELECT groupArray(created_date) FROM users');
        });

        it('generates arrayJoin(X) as expression', () => {
            const q = getQuery();
            const sql = q.select([fx.arrayJoin('created_date')]).from('users').generateSql();
            expect(sql).toEqual('SELECT arrayJoin(created_date) FROM users');
        });

        it('generates arrayJoin(X) expression as scalar', () => {
            const q = getQuery();
            const sql = q.select([fx.arrayJoin(expr('created_date'))]).from('users').generateSql();
            expect(sql).toEqual('SELECT arrayJoin(created_date) FROM users');
        });

        it('generates subtractDays()', () => {
            const q = getQuery();
            const sql = q.select([fx.subtractDays('now()', 10)]).from('users').generateSql();
            expect(sql).toEqual('SELECT subtractDays(now(), 10) FROM users');
        });

        it('generates subtractDays() as param', () => {
            const q = getQuery();
            const sql = q.select([fx.subtractDays('now()', '{param:UInt32}')]).from('users').generateSql();
            expect(sql).toEqual('SELECT subtractDays(now(), {param:UInt32}) FROM users');
        });

        it('generates indexOf() with string as haystack (expression)', () => {
            const q = getQuery();
            const sql = q.select([fx.indexOf(expr('first_name'), '{name:String}')]).from('users').generateSql();
            expect(sql).toEqual(`SELECT indexOf(first_name, {name:String}) FROM users`);
        });

        it('generates indexOf() with string as haystack (scalar)', () => {
            const q = getQuery();
            const sql = q.select([fx.indexOf('first_name', '{name:String}')]).from('users').generateSql();
            expect(sql).toEqual(`SELECT indexOf(first_name, {name:String}) FROM users`);
        });

        it('generates indexOf() with number as haystack', () => {
            const q = getQuery();
            const sql = q.select([fx.indexOf(expr('first_name'), 1)]).from('users').generateSql();
            expect(sql).toEqual(`SELECT indexOf(first_name, 1) FROM users`);
        });

        it('generates indexOf() with number as haystack (scalar)', () => {
            const q = getQuery();
            const sql = q.select([fx.indexOf('first_name', 1)]).from('users').generateSql();
            expect(sql).toEqual(`SELECT indexOf(first_name, 1) FROM users`);
        });

        it('generates empty()', () => {
            const q = getQuery();
            const sql = q.select([
                fx.empty(
                    fx.groupArray('price')
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT empty(groupArray(price)) FROM users`);
        });

        it('generates positionCaseInsensitive() as haystack (expression)', () => {
            const q = getQuery();
            const sql = q.select([
                fx.positionCaseInsensitive(
                    fx.translateUTF8(
                        expr('first_name'),
                        'ÁáČ',
                        'AaC'
                    ),
                    '{name:String}',
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT positionCaseInsensitive(translateUTF8(first_name, 'ÁáČ', 'AaC'), {name:String}) FROM users`);
        });

        it('generates positionCaseInsensitive() as haystack (scalar)', () => {
            const q = getQuery();
            const sql = q.select([
                fx.positionCaseInsensitive(
                    fx.translateUTF8(
                        'first_name',
                        'ÁáČ',
                        'AaC'
                    ),
                    '{name:String}',
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT positionCaseInsensitive(translateUTF8(first_name, 'ÁáČ', 'AaC'), {name:String}) FROM users`);
        });

        it('generates positionCaseInsensitive() with nested expression', () => {
            const q = getQuery();
            const sql = q.select([
                fx.positionCaseInsensitive(
                    expr('first_name'),
                    fx.translateUTF8(
                        expr('first_name'),
                        'ÁáČ',
                        'AaC'
                    ),
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT positionCaseInsensitive(first_name, translateUTF8(first_name, 'ÁáČ', 'AaC')) FROM users`);
        });

        it('generates positionCaseInsensitive() as needle (scalar)', () => {
            const q = getQuery();
            const sql = q.select([
                fx.positionCaseInsensitive(
                    expr('first_name'),
                    fx.translateUTF8(
                        expr('first_name'),
                        'ÁáČ',
                        'AaC'
                    ),
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT positionCaseInsensitive(first_name, translateUTF8(first_name, 'ÁáČ', 'AaC')) FROM users`);
        });

        it('generates positionCaseInsensitive() with param as needle', () => {
            const q = getQuery();
            const sql = q.select([
                fx.positionCaseInsensitive(
                    expr('first_name'),
                    '{name:String}'
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT positionCaseInsensitive(first_name, {name:String}) FROM users`);
        });

        it('generates positionCaseInsensitive() with number as needle', () => {
            const q = getQuery();
            const sql = q.select([
                fx.positionCaseInsensitive(
                    expr('first_name'),
                    1
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT positionCaseInsensitive(first_name, 1) FROM users`);
        });

        it('generates translateUTF8() as expressions', () => {
            const q = getQuery();
            const sql = q.select([
                fx.translateUTF8(
                    expr('first_name'),
                    'ÁáČ',
                    'AaC'
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT translateUTF8(first_name, 'ÁáČ', 'AaC') FROM users`);
        });

        it('generates translateUTF8() as scalar', () => {
            const q = getQuery();
            const sql = q.select([
                fx.translateUTF8(
                    'first_name',
                    'ÁáČ',
                    'AaC'
                )
            ])
                .from('users')
                .generateSql();
            expect(sql).toEqual(`SELECT translateUTF8(first_name, 'ÁáČ', 'AaC') FROM users`);
        });
    });

    describe('WITH', () => {
        it('simple with', () => {
            const q = getQuery();
            const sql = q
                .with([
                    expr("toStartOfDay(toDate('2021-01-01'))").as('start'),
                    expr("toStartOfDay(toDate('2021-01-02'))").as('end'),
                ])
                .select([
                    fx.arrayJoin(
                        expr('arrayMap(x -> toDateTime(x), range(toUInt32(start), toUInt32(end), 3600))')
                    )
                ])
                .generateSql();
            expect(sql).toBe(`WITH toStartOfDay(toDate('2021-01-01')) AS start, toStartOfDay(toDate('2021-01-02')) AS end SELECT arrayJoin(arrayMap(x -> toDateTime(x), range(toUInt32(start), toUInt32(end), 3600)))`);
        });

        it('Using constant expression as “variable”', () => {
            const q = getQuery();
            const sql = q
                .with('2019-08-01 15:23:00', 'ts_upper_bound')
                .select('*')
                .from('hits')
                .where('EventDate', '=', expr('toDate(ts_upper_bound)'))
                .andWhere('EventTime', '<', expr('ts_upper_bound'))
                .generateSql();
            expect(sql).toBe(`WITH '2019-08-01 15:23:00' AS ts_upper_bound SELECT * FROM hits WHERE EventDate = toDate(ts_upper_bound) AND EventTime < ts_upper_bound`);
        });

        it('Evicting an expression result from the SELECT clause column list', () => {
            const q = getQuery();
            const sql = q
                .with([fx.sum(expr('bytes'))], 's')
                .select([expr('formatReadableSize(s)'), expr('table')])
                .from('system.parts')
                .groupBy(['table'])
                .orderBy([['s', 'ASC']])
                .generateSql();
            expect(sql).toBe(`WITH sum(bytes) AS s SELECT formatReadableSize(s), table FROM system.parts GROUP BY table ORDER BY s ASC`);
        });

        it('Using results of a scalar subquery', () => {
            const q = getQuery();
            const q2 = getQuery();
            const sql = q
                .with([
                    q2.select([fx.sum(expr('bytes'))])
                        .from('system.parts')
                        .where('active', '=', 1)
                        .as('total_disk_usage')
                ])
                .select([expr('(sum(bytes) / total_disk_usage) * 100 AS table_disk_usage'), expr('table')])
                .from('system.parts')
                .groupBy(['table'])
                .orderBy([['table_disk_usage', 'DESC']])
                .limit(10)
                .generateSql();
            expect(sql).toBe(`WITH (SELECT sum(bytes) FROM system.parts WHERE active = 1) AS total_disk_usage SELECT (sum(bytes) / total_disk_usage) * 100 AS table_disk_usage, table FROM system.parts GROUP BY table ORDER BY table_disk_usage DESC LIMIT 10`);
        });
    });

    describe('SELECT', () => {
        it('selects all by default', () => {
            const query = getQuery();
            const sql = query.from('users').generateSql();
            expect(sql).toBe('SELECT * FROM users');
        });

        it('selects one column', () => {
            const query = getQuery();
            const sql = query.select('id').from('users').generateSql();
            expect(sql).toBe('SELECT id FROM users');
        });

        it('selects multiple columns', () => {
            const query = getQuery();
            const sql = query.select(['id', 'first_name', 'last_name']).from('users').generateSql();
            expect(sql).toBe('SELECT id, first_name, last_name FROM users');
        });

        it('can process subquery', () => {
            const query = getQuery();
            const sql = query
                .select([
                    'ip',
                    getQuery()
                        .select('created_date')
                        .from('user_visits')
                        .select('created_date')
                        .where('user_id', '=', 1)
                        .orderBy([['created_date', 'ASC']])
                        .limit(1)
                        .offset(0)
                        .as('first_visit_date'),
                ])
                .from('users')
                .where('user_id', '=', 1)
                .generateSql();

            expect(sql).toBe('SELECT ip, (SELECT created_date FROM user_visits WHERE user_id = 1 ORDER BY created_date ASC OFFSET 0 ROW FETCH FIRST 1 ROWS ONLY) AS first_visit_date FROM users WHERE user_id = 1');
        });

        it('can use multiple helper functions', () => {
            const query = getQuery();
            const sql = query
                .select([
                    fx.anyLast('price').as('price'),
                    fx.anyLastPos('created_date', 1).as('created_date'),
                    fx.abs('negative_number').as('positive_number'),
                ])
                .from('users')
                .generateSql();

            expect(sql).toBe('SELECT anyLast(price) AS price, anyLast(created_date)[1] AS created_date, abs(negative_number) AS positive_number FROM users');
        });

        it('can use nested helper functions', () => {
            const query = getQuery();
            const sql = query
                .select([
                    fx.round(fx.anyLast('price'), 2).as('price'),
                ])
                .from('users')
                .generateSql();

            expect(sql).toBe('SELECT round(anyLast(price), 2) AS price FROM users');
        });
    })

    describe('FROM', () => {
        it('works without table alias', () => {
            const query = getQuery();
            const sql = query.from('users', 'p').generateSql();
            expect(sql).toBe('SELECT * FROM users AS p');
        });

        it('adds alias to table', () => {
            const query = getQuery();
            const sql = query.from('users').generateSql();
            expect(sql).toBe('SELECT * FROM users');
        });

        it('supports query', () => {
            const q = getQuery();
            const sql = q
                .select(['id', 'email'])
                .from(
                getQuery()
                    .select(['id', 'email'])
                    .from('users')
                    .where('status', '>', 10)
            ).generateSql();
            expect(sql).toBe('SELECT id, email FROM (SELECT id, email FROM users WHERE status > 10)');
        });
    })

    describe('Query WHERE condition', () => {
        it('keeps numeric values as is in WHERE condition', () => {
            const query = getQuery();
            const sql = query
                .from('users')
                .where('id', '=', 1)
                .generateSql();
            expect(sql).toBe('SELECT * FROM users WHERE id = 1');
        });

        it('surrounds string values with quotes in WHERE condition', () => {
            const query = getQuery();
            const sql = query
                .from('users')
                .where('first_name', '=', 'John')
                .generateSql();
            expect(sql).toBe(`SELECT * FROM users WHERE first_name = 'John'`);
        });

        it('Build simple select query with WHERE single condition', () => {
            const query = getQuery();
            const sql = query
                .select('first_name')
                .from('users')
                .where('last_name', '=', 'Alex')
                .generateSql();

            expect(sql).toBe(`SELECT first_name FROM users WHERE last_name = 'Alex'`);
        });

        it('Build select query with multiple WHERE conditions', () => {
            const query = getQuery();
            const sql = query
                .from('users')
                .where('created_date', '=', '2020-01-01')
                .where('first_name', '=', 'John')
                .generateSql();

            expect(sql).toBe(`SELECT * FROM users WHERE created_date = '2020-01-01' AND first_name = 'John'`);
        });

        it('builds WHERE condition with = sign', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('id', '=', 1)
                .generateSql();

            expect(sql).toBe('SELECT id, first_name FROM users WHERE id = 1');
        });

        it('builds WHERE condition with >= sign', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('id', '>=', 1)
                .generateSql();

            expect(sql).toBe('SELECT id, first_name FROM users WHERE id >= 1');
        });

        it('builds WHERE condition with > sign', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('id', '>', 1)
                .generateSql();

            expect(sql).toBe('SELECT id, first_name FROM users WHERE id > 1');
        });

        it('builds WHERE condition with < sign', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('id', '<', 1)
                .generateSql();

            expect(sql).toBe('SELECT id, first_name FROM users WHERE id < 1');
        });

        it('builds WHERE condition with <= sign', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('id', '<=', 1)
                .generateSql();

            expect(sql).toBe('SELECT id, first_name FROM users WHERE id <= 1');
        });

        it('builds WHERE condition with BETWEEN string type', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('created_date', 'BETWEEN', ['2020-01-01', '2020-01-02'])
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users WHERE created_date BETWEEN '2020-01-01' AND '2020-01-02'`);
        });

        it('builds WHERE condition with BETWEEN numeric type', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('created_date', 'BETWEEN', [1, 100])
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users WHERE created_date BETWEEN 1 AND 100`);
        });

        it('builds WHERE condition with IN type', () => {
            const query = getQuery();
            const sql = query
                .select(['id'])
                .from('users')
                .where('id', 'IN', [1, 2, 3])
                .generateSql();

            expect(sql).toBe(`SELECT id FROM users WHERE id IN (1, 2, 3)`);
        });

        it('builds WHERE condition with NOT IN type', () => {
            const query = getQuery();
            const sql = query
                .select(['id'])
                .from('users')
                .where('id', 'NOT IN', [1, 2, 3])
                .generateSql();

            expect(sql).toBe(`SELECT id FROM users WHERE id NOT IN (1, 2, 3)`);
        });

        it('builds WHERE condition with LIKE type post search', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('first_name', 'LIKE', 'John%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users WHERE first_name LIKE 'John%'`);
        });

        it('builds WHERE condition with LIKE type substring search', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('first_name', 'LIKE', '%John%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users WHERE first_name LIKE '%John%'`);
        });


        it('builds WHERE condition with NOT LIKE type post search', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('first_name', 'NOT LIKE', 'John%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users WHERE first_name NOT LIKE 'John%'`);
        });

        it('builds WHERE condition with NOT LIKE type substring search', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .where('first_name', 'NOT LIKE', '%John%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users WHERE first_name NOT LIKE '%John%'`);
        });

        it('builds grouped WHERE (OR) condition with ungrouped where first', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name', 'email'])
                .from('users')
                .where('first_name', 'LIKE', 'John%')
                .andWhereGroup('OR', [
                    ['email', '=', 'john.doe@example.com'],
                    ['last_name', '=', 'Doe'],
                ])
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name, email FROM users WHERE first_name LIKE 'John%' AND (email = 'john.doe@example.com' OR last_name = 'Doe')`);
        });

        it('builds grouped WHERE (OR) condition with ungrouped where last', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name', 'email'])
                .from('users')
                .orWhereGroup('AND', [
                    ['email', '=', 'john.doe@example.com'],
                    ['last_name', '=', 'Doe'],
                ])
                .andWhere('first_name', 'LIKE', 'John%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name, email FROM users WHERE (email = 'john.doe@example.com' AND last_name = 'Doe') AND first_name LIKE 'John%'`);
        });

        it('builds grouped WHERE (AND) condition with ungrouped where first', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name', 'email'])
                .from('users')
                .where('first_name', 'LIKE', 'John%')
                .andWhereGroup('AND', [
                    ['email', '=', 'john.doe@example.com'],
                    ['last_name', '=', 'Doe'],
                ])
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name, email FROM users WHERE first_name LIKE 'John%' AND (email = 'john.doe@example.com' AND last_name = 'Doe')`);
        });

        it('builds grouped WHERE (AND) condition with ungrouped where last', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name', 'email'])
                .from('users')
                .andWhereGroup('AND', [
                    ['email', '=', 'john.doe@example.com'],
                    ['last_name', '=', 'Doe'],
                ])
                .where('first_name', 'LIKE', 'John%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name, email FROM users WHERE (email = 'john.doe@example.com' AND last_name = 'Doe') AND first_name LIKE 'John%'`);
        });

        it('builds multiple grouped WHERE (OR) conditions', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name', 'email'])
                .from('users')
                .orWhereGroup('AND', [
                    ['email', '=', 'john.doe@example.com'],
                    ['last_name', '=', 'Doe'],
                ])
                .orWhereGroup('AND', [
                    ['email', '=', 'alex.test@example.com'],
                    ['last_name', '=', 'Test'],
                ])
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name, email FROM users WHERE (email = 'john.doe@example.com' AND last_name = 'Doe') OR (email = 'alex.test@example.com' AND last_name = 'Test')`);
        });

        it('builds multiple grouped WHERE (OR) conditions with regular AND', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name', 'email'])
                .from('users')
                .orWhereGroup('AND', [
                    ['email', '=', 'john.doe@example.com'],
                    ['last_name', '=', 'Doe'],
                ])
                .orWhereGroup('AND', [
                    ['email', '=', 'alex.test@example.com'],
                    ['last_name', '=', 'Test'],
                ])
                .andWhere('username', 'LIKE', 'john%')
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name, email FROM users WHERE (email = 'john.doe@example.com' AND last_name = 'Doe') OR (email = 'alex.test@example.com' AND last_name = 'Test') AND username LIKE 'john%'`);
        });
    });

    describe('LIMIT/OFFSET', () => {
        it('builds LIMIT and OFFSET parts', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .limit(10)
                .offset(0)
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users OFFSET 0 ROW FETCH FIRST 10 ROWS ONLY`);
        });

        it('LIMIT could be used alone', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users')
                .limit(10)
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users LIMIT 10`);
        });
    });

    describe('JOINs', () => {
        it('simple join', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users', 'u')
                .join(
                    'INNER JOIN',
                    getQuery()
                        .select(['user_id'])
                        .from('posts')
                        .where('id', '>', 1),
                    'p',
                    'p.user_id = u.user_id'
                )
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users AS u INNER JOIN (SELECT user_id FROM posts WHERE id > 1) AS p ON p.user_id = u.user_id`);
        });

        it('uses INNER JOIN as default', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users', 'u')
                .join(
                    'JOIN',
                    getQuery()
                        .select(['user_id'])
                        .from('posts')
                        .where('id', '>', 1),
                    'p',
                    'p.user_id = u.user_id'
                )
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users AS u INNER JOIN (SELECT user_id FROM posts WHERE id > 1) AS p ON p.user_id = u.user_id`);
        });

        it('can have multiple joins', () => {
            const query = getQuery();
            const sql = query
                .select(['id', 'first_name'])
                .from('users', 'u')
                .join(
                    'INNER JOIN',
                    getQuery()
                        .select(['user_id'])
                        .from('posts')
                        .where('id', '>', 1),
                    'p',
                    'p.user_id = u.user_id'
                )
                .join(
                    'INNER JOIN',
                    getQuery()
                        .select(['account_id'])
                        .from('bank_accounts')
                        .where('status', '=', 'active'),
                    'ba',
                    'ba.user_id = u.user_id'
                )
                .generateSql();

            expect(sql).toBe(`SELECT id, first_name FROM users AS u INNER JOIN (SELECT user_id FROM posts WHERE id > 1) AS p ON p.user_id = u.user_id INNER JOIN (SELECT account_id FROM bank_accounts WHERE status = 'active') AS ba ON ba.user_id = u.user_id`);
        });
    })
});
