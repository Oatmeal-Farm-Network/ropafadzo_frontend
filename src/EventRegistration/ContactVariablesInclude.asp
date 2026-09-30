<%
	Set rs = Server.CreateObject("ADODB.Recordset")
	sql = "select * from AndresenEvents "
	rs.Open sql, Conn, 3, 3
		Name = rs("custFirstName")
		City = rs("custCity")			
		State = rs("custState")			
		Phone = rs("custPhone")			
		Email = rs("custEmail")		
		RanchName = rs("custCompany")
		Zip= rs("custZip")
		Street= rs("custAddr1")
		Street2= rs("custAddr2")
		Cell= rs("custphone2")
	rs.close

%>