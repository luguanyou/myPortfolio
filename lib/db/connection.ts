/**
 * MySQL 数据库连接配置
 */
import mysql from 'mysql2/promise';

// 数据库连接配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
  timezone: '+00:00', // UTC
};

// 创建连接池
let pool: mysql.Pool | null = null;

/**
 * 获取数据库连接池
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
    
    // 测试连接
    pool.getConnection()
      .then((connection) => {
        console.log('✅ MySQL 数据库连接成功');
        connection.release();
      })
      .catch((error) => {
        console.error('❌ MySQL 数据库连接失败:', error.message);
        console.error('请检查环境变量配置：DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
      });
  }
  
  return pool;
}

/**
 * 执行查询
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const connection = getPool();
  const [rows] = await connection.execute(sql, params || []);
  return rows as T[];
}

/**
 * 执行单个查询（返回第一条结果）
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results.length > 0 ? results[0] : null;
}

/**
 * 执行插入/更新/删除操作
 */
export async function execute(
  sql: string,
  params?: any[]
): Promise<mysql.ResultSetHeader> {
  const connection = getPool();
  const [result] = await connection.execute(sql, params || []);
  return result as mysql.ResultSetHeader;
}

/**
 * 开始事务
 */
export async function beginTransaction(): Promise<mysql.PoolConnection> {
  const connection = getPool();
  const conn = await connection.getConnection();
  await conn.beginTransaction();
  return conn;
}

/**
 * 提交事务
 */
export async function commit(connection: mysql.PoolConnection): Promise<void> {
  await connection.commit();
  connection.release();
}

/**
 * 回滚事务
 */
export async function rollback(connection: mysql.PoolConnection): Promise<void> {
  await connection.rollback();
  connection.release();
}

/**
 * 关闭连接池（通常在应用关闭时调用）
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('数据库连接池已关闭');
  }
}
