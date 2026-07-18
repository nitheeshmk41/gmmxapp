import '../../../../core/storage/local_database.dart';
import '../models/attendance_model.dart';

/// Local offline storage for attendance records.
class AttendanceLocalDataSource {
  final LocalDatabase _db;

  AttendanceLocalDataSource(this._db);

  /// Insert a new attendance record into the local cache.
  Future<void> cacheAttendance(AttendanceModel attendance) async {
    final database = await _db.database;
    await database.insert(
      'attendance_cache',
      attendance.toJson(),
    );
  }

  /// Get all attendance records that have not been synced.
  Future<List<AttendanceModel>> getPendingSync() async {
    final database = await _db.database;
    final maps = await database.query(
      'attendance_cache',
      where: 'synced = ?',
      whereArgs: [0], // 0 = false
    );

    return maps.map((e) => AttendanceModel.fromJson(e)).toList();
  }

  /// Mark a list of attendance records as successfully synced.
  Future<void> markAsSynced(List<String> ids) async {
    if (ids.isEmpty) return;
    
    final database = await _db.database;
    final placeholders = List.filled(ids.length, '?').join(',');
    
    await database.update(
      'attendance_cache',
      {'synced': 1}, // 1 = true
      where: 'id IN ($placeholders)',
      whereArgs: ids,
    );
  }

  /// Retrieve the history of attendance records from cache.
  Future<List<AttendanceModel>> getAttendanceHistory(
      String memberId, int limit, int offset) async {
    final database = await _db.database;
    final maps = await database.query(
      'attendance_cache',
      where: 'member_id = ?',
      whereArgs: [memberId],
      orderBy: 'check_in_time DESC',
      limit: limit,
      offset: offset,
    );

    return maps.map((e) => AttendanceModel.fromJson(e)).toList();
  }
}
